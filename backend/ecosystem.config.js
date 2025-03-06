module.exports = {
  apps : [{
    name: 'narrativetwist_pm2',
    script: '/home/narrativetwist/htdocs/narrativetwist.app/backend/server.js',
    watch: true,
    env: {
      "NODE_ENV": "development",
       

    },
    env_production: {
      "NODE_ENV": "production",
      "DB_HOST": "127.0.0.1",
      "DB_PORT": "3306",
      "DB_USER": "admin",
      "DB_PASS": "Qpwoei.1928.",
      "DB_NAME": "narrativetwist",
      "MAIL_HOST": "smtp.hostinger.com",
      "MAIL_PORT": "465",
      "MAIL_USER": "verify@narrativetwist.app",
      "MAIL_PASS": "Qpwoei1928.",
      "NT_TOKEN": "Whbj86HN89jjmH",  
      
    }
  }]
};

