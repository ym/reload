var reload = require('reload2');

reload.exclude(/public\/(.*)/g);
reload.exclude(/views\/(.*)/g);

reload.setServer('node', ['app']);
reload.setPath('.');

reload.run();