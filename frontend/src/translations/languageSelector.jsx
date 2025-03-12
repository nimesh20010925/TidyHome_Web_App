import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import arrowDown from '../assets/sideBar/arrowDown.svg';
import arrowUp from '../assets/sideBar/arrowUp.svg';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('preferredLanguage', language);
    setIsExpanded(false);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '0px 8px',
          marginBottom: '0px',
          backgroundColor: '#fff',
          border: 'none',
          outline: 'none',
        }}
      >
        <span style={{ marginRight: '2px', marginBottom: '3px', fontSize: '12px' }}>
          {i18n.language === 'en' ? 'English' : 'සිංහල'}
        </span>
        <img
          src={isExpanded ? arrowUp : arrowDown}
          alt="Dropdown arrow"
          style={{
            width: '22px',
            height: '22px',
            marginTop: '2px'
          }}
        />
      </div>

      {isExpanded && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            border: '0.1vw solid #976BDB',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            width: '95%',
          }}
        >
          <div
            onClick={() => changeLanguage('en')}
            style={{
              padding: '4px',
              paddingLeft: '8px',
              cursor: 'pointer',
              backgroundColor: i18n.language === 'en' ? '#EBBFFF' : '#fff',
              fontSize: '12px',
            }}
          >
            English
          </div>
          <div
            onClick={() => changeLanguage('si')}
            style={{
              padding: '4px',
              paddingLeft: '8px',
              cursor: 'pointer',
              backgroundColor: i18n.language === 'si' ? '#EBBFFF' : '#fff',
              fontSize: '12px',
            }}
          >
            සිංහල
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;