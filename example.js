var reload = require('reload2');

// reload.exclude(/public\/(.*)/g);
// reload.exclude(/app\/views\/(.*)/g);
// reload.exclude(/node_modules\/(.*)/g);
reload.exclude(/(.*)\.ejs/g);
reload.exclude(/(.*)\.swp/g);
reload.exclude(/(.*)\.DS_Store/g);

reload.setServer('node', ['app']);
reload.watch('app');


reload.run();
