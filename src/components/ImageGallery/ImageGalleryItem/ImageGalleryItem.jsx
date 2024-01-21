import css from './ImageGalleryItem.module.css';

export const ImageGalleryItem = ({ largeImage, smallImage, tags, onClick }) => {
  return (
    <li className={css.galleryItem} onClick={() => onClick(largeImage, tags)}>
      <img src={smallImage} alt={tags} className={css.galleryItemImage} />
    </li>
  );
};
