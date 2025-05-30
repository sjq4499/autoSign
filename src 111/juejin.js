const fetch = require('node-fetch');
const sendMail = require('../sendMail');

let [cookie, user, pass, to, yun_cookie, yun_to] = process.argv.slice(2);

process.env.user = user;
process.env.pass = pass;
let score = 0;
let headers = {
  // 'content-type': 'application/json; charset=utf-8',
  // 'user-agent':
  //   'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
  // 'accept-encoding': 'gzip, deflate, br',
  // 'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
  // 'sec-ch-ua':
  //   '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
  // 'sec-ch-ua-mobile': '?0',
  // referer: 'https://juejin.cn/',
  // accept: '*/*',
  cookie,
};

// 抽奖
const drawFn = async () => {
  // 查询今日是否有免费抽奖机会
  // const today = await fetch(
  //   'https://api.juejin.cn/growth_api/v1/lottery_config/get',
  //   {
  //     headers,
  //     method: 'GET',
  //     credentials: 'include',
  //   }
  // ).then((res) => {
  //   console.log(res, 'today res');
  //   return res.json();
  // });

  // if (today.err_no !== 0) return Promise.reject('已经签到！免费抽奖失败！');
  // if (today.data.free_count === 0)
  //   return Promise.resolve('签到成功！今日已经免费抽奖！');

  // 免费抽奖
  // const draw = await fetch('https://api.juejin.cn/growth_api/v1/lottery/draw', {
  //   headers,
  //   method: 'POST',
  //   credentials: 'include',
  // }).then((res) => res.json());

  // if (draw.err_no !== 0) return Promise.reject('已经签到！免费抽奖异常！');
  // console.log(JSON.stringify(draw, null, 2));
  // if (draw.data.lottery_type === 1) score += 66;
  // await lucky();
  // console.log(q, "lucky");恭喜抽到：${draw.data.lottery_name}
  return Promise.resolve(`签到成功！`);
};

// 签到
(async () => {
  // 查询今日是否已经签到
  const today_status = await fetch(
    'https://api.juejin.cn/growth_api/v2/get_today_status',
    {
      headers,
      method: 'GET',
      credentials: 'include',
    }
  ).then((res) => res.json());
  console.log(today_status, 'today_status');
  if (today_status.err_no !== 0) return Promise.reject('签到失败！');
  if (today_status.data.check_in_done) return Promise.resolve('今日已经签到！');

  // 签到
  const check_in = await fetch('https://api.juejin.cn/growth_api/v1/check_in', {
    headers,
    method: 'POST',
    credentials: 'include',
  }).then((res) => res.json());
  console.log(check_in, 'check_in');
  if (check_in.err_no !== 0) return Promise.reject('签到异常！');
  return Promise.resolve(`签到成功！当前积分；${check_in.data.sum_point}`);
})()
  .then((msg) => {
    console.log(msg);
    return fetch('https://api.juejin.cn/growth_api/v1/get_cur_point', {
      headers,
      method: 'GET',
      credentials: 'include',
    }).then((res) => res.json());
  })
  .then((res) => {
    console.log(res);
    score = res.data;
    return drawFn();
  })
  .then((msg) => {
    console.log(msg, 'msg');
    return sendMail({
      from: '掘金',
      to,
      subject: '定时任务成功',
      html: `
        <h1 style="text-align: center">自动签到通知</h1>
        <p style="text-indent: 2em">签到结果：${msg}</p>
        <p style="text-indent: 2em">当前积分：${score}</p><br/>
      `,
    }).catch(console.error);
  })
  .then(() => {
    console.log('邮件发送成功！');
  })
  .catch((err) => {
    console.log(err, 'err');
    sendMail({
      from: '掘金',
      to,
      subject: '定时任务失败',
      html: `
        <h1 style="text-align: center">自动签到通知</h1>
        <p style="text-indent: 2em">执行结果：${err}</p>
        <p style="text-indent: 2em">当前积分：${score}</p><br/>
      `,
    }).catch(console.error);
  });

/**
 * @desc 沾喜气
 */
//  ?aid=&uuid=
const lucky = async () => {
  const res = await fetch(
    'https://api.juejin.cn/growth_api/v1/lottery_lucky/dip_lucky',
    {
      headers,
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ lottery_history_id: '7137922213407096840' }),
    }
  ).then((res) => res.json());
  console.log(res, 'llll');
};

// // 第二个掘金签到
// setTimeout(() => {
//   headers = {
//     'content-type': 'application/json; charset=utf-8',
//     'user-agent':
//       'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
//     'accept-encoding': 'gzip, deflate, br',
//     'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
//     'sec-ch-ua':
//       '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
//     'sec-ch-ua-mobile': '?0',
//     referer: 'https://juejin.cn/',
//     accept: '*/*',
//     cookie: yun_cookie,
//   };

//   (async () => {
//     // 查询今日是否已经签到
//     const today_status = await fetch(
//       'https://api.juejin.cn/growth_api/v1/get_today_status',
//       {
//         headers,
//         method: 'GET',
//         credentials: 'include',
//       }
//     ).then((res) => res.json());

//     if (today_status.err_no !== 0) return Promise.reject('签到失败！');
//     if (today_status.data) return Promise.resolve('今日已经签到！');

//     // 签到
//     const check_in = await fetch(
//       'https://api.juejin.cn/growth_api/v1/check_in',
//       {
//         headers,
//         method: 'POST',
//         credentials: 'include',
//       }
//     ).then((res) => res.json());

//     if (check_in.err_no !== 0) return Promise.reject('签到异常！');
//     return Promise.resolve(`签到成功！当前积分；${check_in.data.sum_point}`);
//   })()
//     .then((msg) => {
//       console.log(msg);
//       return fetch('https://api.juejin.cn/growth_api/v1/get_cur_point', {
//         headers,
//         method: 'GET',
//         credentials: 'include',
//       }).then((res) => res.json());
//     })
//     .then((res) => {
//       console.log(res);
//       score = res.data;
//       return drawFn();
//     })
//     .then((msg) => {
//       console.log(msg, 'msg');
//       return sendMail({
//         from: '掘金',
//         to: yun_to,
//         subject: '定时任务成功-云',
//         html: `
//           <h1 style="text-align: center">自动签到通知</h1>
//           <p style="text-indent: 2em">签到结果：${msg}</p>
//           <p style="text-indent: 2em">当前积分：${score}</p><br/>
//         `,
//       }).catch(console.error);
//     })
//     .then(() => {
//       console.log('邮件发送成功！');
//     })
//     .catch((err) => {
//       console.log(err, 'err');
//       sendMail({
//         from: '掘金',
//         to: yun_to,
//         subject: '定时任务失败-云',
//         html: `
//           <h1 style="text-align: center">自动签到通知</h1>
//           <p style="text-indent: 2em">执行结果：${err}</p>
//           <p style="text-indent: 2em">当前积分：${score}</p><br/>
//         `,
//       }).catch(console.error);
//     });
// }, Math.floor(Math.random() * 10 * 60 * 1000) + 30 * 1000);
