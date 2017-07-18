import App from '../App';
import Backup_List from '../components/backup_list';
const paths = [
  {
    path: '/',
    component: App
  },
  {
    path: '/backups/all',
    component: Backup_List
  }
];

export default paths;