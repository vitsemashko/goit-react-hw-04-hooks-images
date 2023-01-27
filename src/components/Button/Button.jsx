import PropTypes from 'prop-types';
import css from './Button.module.css';

export const Button = ({ onClick }) => (
  <button className={css.Button} onClick={onClick} type="button">
    Load more
  </button>
);
Button.propTypes = {
  onClick: PropTypes.func.isRequired,
};
