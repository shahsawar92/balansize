const dummyQuestions = [
  {
    id: 1,
    question: "What is your favorite color?",
    options: ["Red", "Blue", "Green", "Yellow"],
    translations: {
      ar: {
        question: "ما هو لونك المفضل؟",
        options: ["أحمر", "أزرق", "أخضر", "أصفر"],
      },
      ru: {
        question: "Какой ваш любимый цвет?",
        options: ["Красный", "Синий", "Зеленый", "Желтый"],
      },
    },
    isMultipleAllowed: false,
    tags: ["colors", "preferences", "personal"],
  },
  {
    id: 2,
    question: "What is your favorite food?",
    options: ["Pizza", "Burger", "Sushi", "Pasta"],
    translations: {
      ar: {
        question: "ما هو طعامك المفضل؟",
        options: ["بيتزا", "برجر", "سوشي", "باستا"],
      },
      ru: {
        question: "Какая ваша любимая еда?",
        options: ["Пицца", "Бургер", "Суши", "Паста"],
      },
    },
    isMultipleAllowed: false,
    tags: ["food", "cuisine", "diet"],
  },
  {
    id: 3,
    question: "What is your favorite hobby?",
    options: ["Reading", "Sports", "Traveling", "Gaming"],
    translations: {
      ar: {
        question: "ما هي هوايتك المفضلة؟",
        options: ["قراءة", "رياضة", "سفر", "ألعاب"],
      },
      ru: {},
    },
    isMultipleAllowed: true,
    tags: ["activities", "leisure", "personal"],
  },
];

export default dummyQuestions;
