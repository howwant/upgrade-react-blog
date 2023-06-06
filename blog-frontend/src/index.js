import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './modules/index';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

// yarn redux-devtools-extension 사용안함 삭제바람
const root = ReactDOM.createRoot(document.getElementById('root'));
const store = configureStore({
  reducer : rootReducer,
});

root.render(
  <React.StrictMode>
     <QueryClientProvider client={queryClient}>
      {/* devtools */}
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right'/>
      <Provider store={store}>
      <BrowserRouter>
      <App />
      </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);