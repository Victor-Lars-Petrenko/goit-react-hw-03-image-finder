import { Grid } from 'react-loader-spinner';
import css from './Loader.module.css';

export const Loader = () => {
  return <Grid color="#3f51b5" wrapperClass={css.loader} />;
};
