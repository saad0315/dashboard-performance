import { BASE_URL } from '../constants/constants';
import apiMain from './apiMain';

export const getChatrooms = async () => {
    return (await apiMain.get('/sidebarusers')).data;
};
export const getAdminChatrooms = async () => {
    return (await apiMain.get('/admin/sidebarusers')).data;
};
