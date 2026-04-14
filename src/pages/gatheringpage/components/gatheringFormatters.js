export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/noImage.png';

  if (imagePath.startsWith('http')) return imagePath;

  return `http://localhost:8080${imagePath}`;
};

export const getCategoryText = (category) => {
  const categoryMap = {
    SPORTS: '스포츠',
    SOCIAL: '친목',
    LITERATURE: '문학',
    OUTDOOR: '아웃도어',
    MUSIC: '음악',
    JOB: '직업/취업',
    CULTURE: '문화',
    LANGUAGE: '언어',
    GAME: '게임',
    CRAFT: '공예/만들기',
    DANCE: '댄스',
    VOLUNTEER: '봉사',
    PHOTO: '사진',
    SELF_IMPROVEMENT: '자기계발',
    SPORTS_WATCHING: '스포츠 관람',
    PET: '반려동물',
    COOKING: '요리',
    CAR_BIKE: '자동차/바이크',
    STUDY: '스터디',
  };
  return categoryMap[category] || category;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
