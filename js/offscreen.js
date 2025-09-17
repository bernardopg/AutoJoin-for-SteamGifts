chrome.runtime.onMessage.addListener((msg) => {
  switch (msg.task) {
    case 'parse': {
      const data = parse(msg.data);
      chrome.runtime.sendMessage({
        target: 'background',
        type: 'parsed',
        requestId: msg.requestId,
        payload: data,
      });
      break;
    }
    case 'audio': {
      const audio = new Audio(chrome.runtime.getURL('/media/audio.mp3'));
      audio.volume = msg.data;
      audio.play();
      break;
    }
    case 'redeemKeys': {
      try {
        const parser = new DOMParser();
        const wonPage = parser.parseFromString(msg.data.html, 'text/html');
        redeemKeysFromWonPage(wonPage);
      } catch (e) {
        console.error('Offscreen redeemKeys error:', e);
      }
      break;
    }
    case 'fetch':
    case 'checkPermission':
      break;
    default:
      console.warn(
        `Unknown message type for offscreen document: ${msg.task}`,
        msg,
      );
  }
});

const parseWon = (dom) => {
  return !!dom.querySelector('.popup--gift-received');
};

const parseWonName = (dom) => {
  return dom.querySelector('.table__column__heading')?.textContent?.trim();
};

const parseMyLevel = (dom) => {
  const el = dom.querySelector('a[href="/account"] span:last-child');
  const t = el?.getAttribute('title') || el?.textContent || '0';
  const m = (t.match(/\d+/) || [0])[0];
  return parseInt(m, 10) || 0;
};

const parseMyPoints = (dom) => {
  const txt = dom.querySelector('span.nav__points')?.textContent || '0';
  return parseInt(txt.replace(/,/g, ''), 10) || 0;
};

const parseToken = (dom) => {
  return dom.querySelector('input[name=xsrf_token]')?.value || '';
};

const parseGiveawayCode = (item) => {
  const t = item.href.match(/giveaway\/(.+)\//);
  return t && t.length > 1 ? t[1] : '';
};

const parseGiveawayLevel = (ga) => {
  const levelElement = ga.querySelector(
    '.giveaway__column--contributor-level--positive',
  );
  return levelElement ? levelElement.innerHTML.match(/(\d+)/)[1] : 0;
};

const parseSteamAppInfo = (ga) => {
  const s = ga.querySelector('.giveaway_image_thumbnail')?.style
    ?.backgroundImage;
  const result = { GAsteamAppID: '0', GAsteamIDType: 'app' };

  if (s !== undefined) {
    const c = s.match(/.+(?:apps|subs)\/(\d+)\/cap.+/);
    if (s && c) {
      result.GAsteamAppID = c[1];
      result.GAsteamIDType = s.includes('/apps/') ? 'app' : 'sub';
    }
  }

  return result;
};

const parseGiveawayCopies = (ga) => {
  const regexResult = ga
    .querySelector('.giveaway__heading__thin')
    .textContent.replace(',', '')
    .match(/\((\d+) Copies\)/);
  return regexResult ? parseInt(regexResult[1], 10) : 1;
};

const parseGiveawayData = (item) => {
  const resultGA = {
    GAcode: '',
    GAlevel: 0,
    GAsteamAppID: '0',
    GAsteamIDType: 'app',
    cost: '',
    timeEnd: 0,
    timeStart: 0,
    isGroupGA: false,
    levelTooHigh: false,
    numberOfEntries: 100,
    numberOfCopies: 1,
  };

  const ga = item.parentElement.parentElement.parentElement;

  resultGA.GAcode = parseGiveawayCode(item);
  resultGA.levelTooHigh = !!ga.querySelector(
    '.giveaway__column--contributor-level--negative',
  );
  resultGA.GAlevel = parseGiveawayLevel(ga);

  const steamInfo = parseSteamAppInfo(ga);
  resultGA.GAsteamAppID = steamInfo.GAsteamAppID;
  resultGA.GAsteamIDType = steamInfo.GAsteamIDType;

  resultGA.cost = [...ga.querySelectorAll('.giveaway__heading__thin')]
    .pop()
    .innerHTML.match(/\d+/)[0];

  resultGA.timeEnd = parseInt(
    ga.querySelector('.fa-clock-o').parentElement.querySelector('span').dataset
      .timestamp,
    10,
  );

  resultGA.numberOfEntries = parseInt(
    ga
      .querySelector('.giveaway__links a[href$="/entries"]')
      ?.textContent.replace(',', ''),
    10,
  );

  resultGA.numberOfCopies = parseGiveawayCopies(ga);

  resultGA.timeStart = parseInt(
    ga.querySelector('.giveaway__username').parentElement.querySelector('span')
      .dataset.timestamp,
    10,
  );

  return resultGA;
};

const parseGiveaways = (dom) => {
  const gaElements = [
    ...dom.querySelectorAll(
      '.giveaway__row-inner-wrap:not(.is-faded) .giveaway__heading__name',
    ),
  ];

  return gaElements.map(parseGiveawayData);
};

const parse = (data) => {
  const result = {};
  const html = data.html;
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, 'text/html');

  for (const item of data.items) {
    switch (item) {
      case 'won':
        result.won = parseWon(dom);
        break;
      case 'wonName': {
        const name = parseWonName(dom);
        if (name) result.wonName = name;
        break;
      }
      case 'myLevel':
        result.myLevel = parseMyLevel(dom);
        break;
      case 'myPoints':
        result.myPoints = parseMyPoints(dom);
        break;
      case 'token':
        result.token = parseToken(dom);
        break;
      case 'giveawaysWithoutPinned': {
        const container = dom.querySelector(
          ':not(.pinned-giveaways__inner-wrap) > .giveaway__row-outer-wrap',
        )?.parentElement;
        const scope = container || dom;
        result.giveawaysWithoutPinned = parseGiveaways(scope);
        break;
      }
      case 'giveaways':
        result[item] = parseGiveaways(dom);
        break;
      default:
        console.warn(
          `Unknown item requested while parsing html in offscreen document: ${item}`,
        );
    }
  }

  return result;
};

// Redeem Steam keys found on the won page and notify via background
async function redeemKeysFromWonPage(wonPage) {
  const notify = (message) => {
    chrome.runtime.sendMessage({ task: 'notifyKey', message });
  };

  const keyButtons = wonPage.querySelectorAll('.view_key_btn');
  for (const keyBtn of keyButtons) {
    try {
      const dataForm =
        keyBtn.parentElement.nextElementSibling.querySelector('form');
      const winnerId = dataForm.querySelector("input[name='winner_id']").value;
      const xsrfToken = dataForm.querySelector(
        "input[name='xsrf_token']",
      ).value;

      const formData = new FormData();
      formData.append('do', 'view_key');
      formData.append('winner_id', winnerId);
      formData.append('xsrf_token', xsrfToken);

      const res = await fetch('https://www.steamgifts.com/ajax.php', {
        method: 'post',
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) {
        console.error(
          'Failed to request key from SteamGifts, HTTP',
          res.status,
        );
        continue;
      }
      const json = await res.json();
      const data = JSON.stringify(json);
      const startIndex = data.indexOf('?key=') + 5;
      const endIndex =
        startIndex + data.substring(data.indexOf('?key=')).indexOf('\\') - 5;
      const key = data.substring(startIndex, endIndex);

      if (!/^[A-Z0-9]{4,6}-[A-Z0-9]{4,6}-[A-Z0-9]{4,6}$/i.test(key)) {
        console.warn('Invalid key format received:', key);
        notify(`Invalid Format!\nCode: ${key} was not redeemed!`);
        continue;
      }

      const storeRes = await fetch('https://store.steampowered.com', {
        credentials: 'include',
      });
      const storeHtml = await storeRes.text();
      if (storeHtml.indexOf('g_sessionID') === -1) {
        console.warn('Steam session not available in offscreen context');
        notify(
          `Could not redeem code automatically. Please redeem manually: ${key}`,
        );
        continue;
      }

      const steamSessionId = storeHtml.substring(
        storeHtml.indexOf('g_sessionID') + 15,
        storeHtml.indexOf('g_sessionID') + 15 + 24,
      );
      const regData = new FormData();
      regData.append('product_key', key);
      regData.append('sessionid', steamSessionId);
      const regRes = await fetch(
        'https://store.steampowered.com/account/ajaxregisterkey/',
        {
          method: 'post',
          body: regData,
          credentials: 'include',
        },
      );
      if (!regRes.ok) {
        console.error('Steam key redeem request failed, HTTP', regRes.status);
        notify(`Redeem failed (HTTP ${regRes.status}). Code: ${key}`);
        continue;
      }
      const regJson = await regRes.json();
      if (regJson && regJson.success === 1) {
        notify(`Code redeemed! ${key}`);
      } else {
        const reason = regJson?.purchase_result_details ?? 'Unknown';
        notify(`Redeem unsuccessful (${reason}). Code: ${key}`);
      }
    } catch (e) {
      console.error('Error during key redemption:', e);
      notify('Unexpected error while redeeming a key.');
    }
  }
}
