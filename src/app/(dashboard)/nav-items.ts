import { routes } from '@/shared/routes';

import {
  ChartBarRegular,
  ChartBarFill,

  ChatsRegular,
  ChatsFill,

  ListBulletsRegular,
  ListBulletsFill,

  GearSixRegular,
  GearSixFill

} from '@/shared/ds/icons';

export const navItems = [
  {
    id: 'statistics',
    title: 'Статистика',
    iconDefault: ChartBarRegular,
    iconActive: ChartBarFill,
    path: routes.statistics
  },
  {
    id: 'reviews',
    title: 'Отзывы',
    iconDefault: ChatsRegular,
    iconActive: ChatsFill,
    path: routes.reviews
  },
  {
    id: 'places',
    title: 'Мои заведения',
    iconDefault: ListBulletsRegular,
    iconActive: ListBulletsFill,
    path: routes.places
  },
  {
    id: 'settings',
    title: 'Настройки',
    iconDefault: GearSixRegular,
    iconActive: GearSixFill,
    path: routes.settings
  }
];
