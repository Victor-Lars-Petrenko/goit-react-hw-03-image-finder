import { ImageGalleryItem } from './ImageGalleryItem';
import css from './ImageGallery.module.css';

export const ImageGallery = ({ items, onClick }) => {
  return (
    <ul className={css.gallery}>
      {items.map(({ id, webformatURL, largeImageURL, tags }) => (
        <ImageGalleryItem
          key={id}
          largeImage={largeImageURL}
          smallImage={webformatURL}
          tags={tags}
          onClick={onClick}
        />
      ))}
    </ul>
  );
};
