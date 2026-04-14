export const formatGatheringDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getGatheringCategoryColor = (category) => {
  const colors = {
    SPORTS: '#FF6B6B',
    SOCIAL: '#4ECDC4',
    LITERATURE: '#9B59B6',
    OUTDOOR: '#2ECC71',
    MUSIC: '#E74C3C',
    JOB: '#34495E',
    CULTURE: '#8E44AD',
    LANGUAGE: '#3498DB',
    GAME: '#F39C12',
    CRAFT: '#D35400',
    DANCE: '#E91E63',
    VOLUNTEER: '#27AE60',
    PHOTO: '#95A5A6',
    SELF_IMPROVEMENT: '#16A085',
    SPORTS_WATCHING: '#FF8C94',
    PET: '#FFB347',
    COOKING: '#FFA07A',
    CAR_BIKE: '#708090',
    STUDY: '#45B7D1',
  };
  return colors[category] || '#DDA0DD';
};

export const getGatheringCategoryText = (category) => {
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
