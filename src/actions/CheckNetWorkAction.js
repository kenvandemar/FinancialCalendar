import {
    CHECK_NETWORK_INFO
} from './constants.js';

export const checkNetWorkInfo = (status) => {
  return { type: CHECK_NETWORK_INFO, isConnected: status };
};