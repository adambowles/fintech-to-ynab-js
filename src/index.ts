import * as Koa from 'koa';
import * as BodyParser from 'koa-bodyparser';

require('dotenv').config();

const app = new Koa();
import router from './router';

app.use(BodyParser());
app.use(router.routes());

const port = process.env.PORT || 3000;
app.listen(port);

console.log(`Server running on port ${port}`);
