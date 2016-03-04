import { createHistory, useQueries } from 'history'

import app from './../../app';

app(useQueries(createHistory));
