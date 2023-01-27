import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { fetchImages } from './api/fetchImages';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import React from 'react';

export const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');
  const [pageNr, setPageNr] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState('');
  const [modalAlt, setModalAlt] = useState('');
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!currentSearch) {
      return;
    }
    setIsLoading(true);
    fetchImages(currentSearch, pageNr)
      .then(data => {
        setImages(prev => {
          return [...prev, ...data];
        });
      })
      .catch(error => {
        setError(error.message);
      })
      .finally(() => setIsLoading(false));
  }, [currentSearch, pageNr]);

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === 'Escape') {
        setModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
  }, [modalOpen]);
  const handleSubmit = e => {
    e.preventDefault();
    const { inputForSearch } = e.target.elements;
    if (inputForSearch.value.trim() === '') {
      return;
    }
    if (currentSearch !== inputForSearch.value) {
      setImages([]);
      setIsLoading(false);
      setCurrentSearch(inputForSearch.value);
      setPageNr(1);
    }
  };

  const handleClickMore = () => {
    setPageNr(pageNr + 1);
  };

  const handleImageClick = e => {
    setModalOpen(true);
    setModalAlt(e.target.alt);
    setModalImg(e.target.name);
  };

  const handleModalClose = e => {
    if (e.target.tagName === 'IMG') {
      return;
    }
    setModalOpen(false);
    setModalImg('');
    setModalAlt('');
  };
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridGap: '16px',
        paddingBottom: '24px',
      }}
    >
      <>
        <Searchbar onSubmit={handleSubmit} />
        {isLoading && <Loader />}
        <ImageGallery onImageClick={handleImageClick} images={images} />
        {error && <p>An error occurred. Please try again</p>}
        {images.length > 0 ? <Button onClick={handleClickMore} /> : null}
      </>
      {modalOpen ? (
        <Modal src={modalImg} alt={modalAlt} handleClose={handleModalClose} />
      ) : null}
    </div>
  );
};
