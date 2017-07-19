import Backup_List from '../components/backup_list';
import Version_List from '../components/version_list';
const paths = [
  {
    path: '/backups/all',
    component: Backup_List
  },
  {
    path: '/backups/version',
    component: Version_List
  }
];

export default paths;
