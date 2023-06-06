import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer, { rootSaga } from './modules/index';
import createSagaMiddleware from '@redux-saga/core';

const sagaMiddleware = createSagaMiddleware();

// yarn redux-devtools-extension 사용안함 삭제바람
const root = ReactDOM.createRoot(document.getElementById('root'));
const store = configureStore({
  reducer : rootReducer,
  middleware: [sagaMiddleware]
});
sagaMiddleware.run(rootSaga);

root.render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </Provider>
  </React.StrictMode>
);