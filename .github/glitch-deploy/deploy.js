const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://81c6e5a1-236e-41ff-90a5-d0d592153e22@api.glitch.com/git/tar-sore-nail|https://81c6e5a1-236e-41ff-90a5-d0d592153e22@api.glitch.com/git/sly-freckle-roadrunner|https://81c6e5a1-236e-41ff-90a5-d0d592153e22@api.glitch.com/git/seasoned-florentine-helicona|https://81c6e5a1-236e-41ff-90a5-d0d592153e22@api.glitch.com/git/satin-panoramic-glitter|https://81c6e5a1-236e-41ff-90a5-d0d592153e22@api.glitch.com/git/heather-equal-basketball|https://81c6e5a1-236e-41ff-90a5-d0d592153e22@api.glitch.com/git/enthusiastic-knowing-tapir|https://81c6e5a1-236e-41ff-90a5-d0d592153e22@api.glitch.com/git/actually-zany-thing|https://81c6e5a1-236e-41ff-90a5-d0d592153e22@api.glitch.com/git/exuberant-nonstop-thunbergia|https://81c6e5a1-236e-41ff-90a5-d0d592153e22@api.glitch.com/git/harmonious-beryl-skiff|https://81c6e5a1-236e-41ff-90a5-d0d592153e22@api.glitch.com/git/enshrined-luxurious-string|https://81c6e5a1-236e-41ff-90a5-d0d592153e22@api.glitch.com/git/glass-citrine-metacarpal|https://81c6e5a1-236e-41ff-90a5-d0d592153e22@api.glitch.com/git/certain-purrfect-argument|https://81c6e5a1-236e-41ff-90a5-d0d592153e22@api.glitch.com/git/flannel-fragrant-coffee|https://81c6e5a1-236e-41ff-90a5-d0d592153e22@api.glitch.com/git/bumpy-low-relative`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();