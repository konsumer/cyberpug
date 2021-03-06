// This adds auto-update on push (via webhook)
// requires you to run `git remote add origin YOUR_REPO_URL` in glitch-terminal
// TODO: Should I do that when this loads?

const express = require('express')
const crypto = require('crypto')
const cmd = require('node-cmd')

module.exports = (GITHUB_SECRET) => {
  const app = express()
  app.post('/github', (req, res) => {
  // always answer github pings
    if (req.headers['x-github-event'] === 'ping') {
      return res.send('pong')
    }

    // check signature
    const hmac = crypto.createHmac('sha1', GITHUB_SECRET)
    const sig = `sha1=${hmac.update(JSON.stringify(req.body)).digest('hex')}`
    if (req.headers['x-github-event'] === 'push' && sig === req.headers['x-hub-signature']) {
      const branch = req.body.ref.replace('refs/heads/', '')
      cmd.get(`git fetch origin ${branch} && git reset --hard origin/${branch} && git pull origin ${branch} --force`, (err, data) => {
        if (data) console.log(data)
        if (err) {
          console.error(err)
          res.status(500).send('An error occurred.')
        } else {
          cmd.run('refresh')
          return res.send(`OK. Current deployment is ${branch}.`)
        }
      })
    } else {
      res.status(500).send('Bad git request. Make sure you have correct github-secret and this only responds to push.')
    }
  })
  return app
}
