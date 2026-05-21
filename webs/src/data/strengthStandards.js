// VORO Strength Standards Database
// Strength classification by exercise, bodyweight, and gender

export const strengthStandards = {
  benchPress: {
    male: [
      { bodyweight: "132 lbs (60kg)", beginner: 95, novice: 150, intermediate: 205, advanced: 280, elite: 350 },
      { bodyweight: "148 lbs (67kg)", beginner: 105, novice: 170, intermediate: 230, advanced: 310, elite: 385 },
      { bodyweight: "165 lbs (75kg)", beginner: 120, novice: 185, intermediate: 255, advanced: 340, elite: 420 },
      { bodyweight: "181 lbs (82kg)", beginner: 130, novice: 200, intermediate: 275, advanced: 370, elite: 455 },
      { bodyweight: "198 lbs (90kg)", beginner: 140, novice: 215, intermediate: 295, advanced: 395, elite: 485 },
      { bodyweight: "220 lbs (100kg)", beginner: 155, novice: 235, intermediate: 320, advanced: 430, elite: 530 },
      { bodyweight: "242 lbs (110kg)", beginner: 165, novice: 250, intermediate: 340, advanced: 460, elite: 565 }
    ],
    female: [
      { bodyweight: "114 lbs (52kg)", beginner: 40, novice: 65, intermediate: 95, advanced: 135, elite: 175 },
      { bodyweight: "123 lbs (56kg)", beginner: 45, novice: 70, intermediate: 105, advanced: 150, elite: 195 },
      { bodyweight: "132 lbs (60kg)", beginner: 50, novice: 75, intermediate: 115, advanced: 165, elite: 215 },
      { bodyweight: "148 lbs (67kg)", beginner: 55, novice: 85, intermediate: 130, advanced: 190, elite: 245 },
      { bodyweight: "165 lbs (75kg)", beginner: 65, novice: 95, intermediate: 145, advanced: 210, elite: 270 },
      { bodyweight: "181 lbs (82kg)", beginner: 70, novice: 105, intermediate: 160, advanced: 235, elite: 305 }
    ]
  },

  squat: {
    male: [
      { bodyweight: "132 lbs (60kg)", beginner: 135, novice: 225, intermediate: 305, advanced: 405, elite: 500 },
      { bodyweight: "148 lbs (67kg)", beginner: 155, novice: 250, intermediate: 340, advanced: 450, elite: 550 },
      { bodyweight: "165 lbs (75kg)", beginner: 175, novice: 280, intermediate: 385, advanced: 510, elite: 625 },
      { bodyweight: "181 lbs (82kg)", beginner: 190, novice: 305, intermediate: 415, advanced: 550, elite: 670 },
      { bodyweight: "198 lbs (90kg)", beginner: 210, novice: 330, intermediate: 450, advanced: 595, elite: 725 },
      { bodyweight: "220 lbs (100kg)", beginner: 230, novice: 360, intermediate: 490, advanced: 650, elite: 800 },
      { bodyweight: "242 lbs (110kg)", beginner: 250, novice: 390, intermediate: 530, advanced: 705, elite: 865 }
    ],
    female: [
      { bodyweight: "114 lbs (52kg)", beginner: 65, novice: 115, intermediate: 175, advanced: 260, elite: 350 },
      { bodyweight: "123 lbs (56kg)", beginner: 75, novice: 125, intermediate: 190, advanced: 280, elite: 375 },
      { bodyweight: "132 lbs (60kg)", beginner: 85, novice: 140, intermediate: 210, advanced: 310, elite: 415 },
      { bodyweight: "148 lbs (67kg)", beginner: 95, novice: 160, intermediate: 245, advanced: 360, elite: 480 },
      { bodyweight: "165 lbs (75kg)", beginner: 110, novice: 180, intermediate: 270, advanced: 400, elite: 530 },
      { bodyweight: "181 lbs (82kg)", beginner: 120, novice: 200, intermediate: 305, advanced: 450, elite: 600 }
    ]
  },

  deadlift: {
    male: [
      { bodyweight: "132 lbs (60kg)", beginner: 155, novice: 260, intermediate: 355, advanced: 475, elite: 585 },
      { bodyweight: "148 lbs (67kg)", beginner: 180, novice: 290, intermediate: 390, advanced: 520, elite: 640 },
      { bodyweight: "165 lbs (75kg)", beginner: 205, novice: 325, intermediate: 430, advanced: 575, elite: 705 },
      { bodyweight: "181 lbs (82kg)", beginner: 225, novice: 355, intermediate: 470, advanced: 625, elite: 770 },
      { bodyweight: "198 lbs (90kg)", beginner: 250, novice: 385, intermediate: 510, advanced: 680, elite: 840 },
      { bodyweight: "220 lbs (100kg)", beginner: 275, novice: 415, intermediate: 550, advanced: 735, elite: 905 },
      { bodyweight: "242 lbs (110kg)", beginner: 295, novice: 445, intermediate: 595, advanced: 795, elite: 975 }
    ],
    female: [
      { bodyweight: "114 lbs (52kg)", beginner: 75, novice: 135, intermediate: 205, advanced: 305, elite: 405 },
      { bodyweight: "123 lbs (56kg)", beginner: 85, novice: 150, intermediate: 225, advanced: 335, elite: 445 },
      { bodyweight: "132 lbs (60kg)", beginner: 100, novice: 165, intermediate: 245, advanced: 365, elite: 485 },
      { bodyweight: "148 lbs (67kg)", beginner: 115, novice: 190, intermediate: 285, advanced: 425, elite: 565 },
      { bodyweight: "165 lbs (75kg)", beginner: 130, novice: 210, intermediate: 315, advanced: 470, elite: 625 },
      { bodyweight: "181 lbs (82kg)", beginner: 145, novice: 235, intermediate: 350, advanced: 525, elite: 700 }
    ]
  },

  overheadPress: {
    male: [
      { bodyweight: "132 lbs (60kg)", beginner: 50, novice: 85, intermediate: 120, advanced: 160, elite: 205 },
      { bodyweight: "148 lbs (67kg)", beginner: 60, novice: 95, intermediate: 135, advanced: 180, elite: 230 },
      { bodyweight: "165 lbs (75kg)", beginner: 70, novice: 110, intermediate: 155, advanced: 210, elite: 270 },
      { bodyweight: "181 lbs (82kg)", beginner: 80, novice: 125, intermediate: 170, advanced: 230, elite: 295 },
      { bodyweight: "198 lbs (90kg)", beginner: 90, novice: 140, intermediate: 190, advanced: 255, elite: 325 },
      { bodyweight: "220 lbs (100kg)", beginner: 100, novice: 155, intermediate: 210, advanced: 285, elite: 365 },
      { bodyweight: "242 lbs (110kg)", beginner: 110, novice: 170, intermediate: 230, advanced: 310, elite: 400 }
    ],
    female: [
      { bodyweight: "114 lbs (52kg)", beginner: 20, novice: 35, intermediate: 55, advanced: 80, elite: 110 },
      { bodyweight: "123 lbs (56kg)", beginner: 25, novice: 40, intermediate: 60, advanced: 90, elite: 125 },
      { bodyweight: "132 lbs (60kg)", beginner: 30, novice: 45, intermediate: 70, advanced: 105, elite: 145 },
      { bodyweight: "148 lbs (67kg)", beginner: 35, novice: 55, intermediate: 85, advanced: 125, elite: 175 },
      { bodyweight: "165 lbs (75kg)", beginner: 40, novice: 65, intermediate: 100, advanced: 145, elite: 205 },
      { bodyweight: "181 lbs (82kg)", beginner: 45, novice: 75, intermediate: 115, advanced: 165, elite: 235 }
    ]
  },

  barrowRow: {
    male: [
      { bodyweight: "132 lbs (60kg)", beginner: 115, novice: 190, intermediate: 275, advanced: 375, elite: 480 },
      { bodyweight: "148 lbs (67kg)", beginner: 135, novice: 215, intermediate: 310, advanced: 425, elite: 545 },
      { bodyweight: "165 lbs (75kg)", beginner: 155, novice: 245, intermediate: 350, advanced: 480, elite: 615 },
      { bodyweight: "181 lbs (82kg)", beginner: 175, novice: 270, intermediate: 385, advanced: 530, elite: 680 },
      { bodyweight: "198 lbs (90kg)", beginner: 195, novice: 300, intermediate: 425, advanced: 585, elite: 750 },
      { bodyweight: "220 lbs (100kg)", beginner: 215, novice: 330, intermediate: 470, advanced: 650, elite: 835 },
      { bodyweight: "242 lbs (110kg)", beginner: 235, novice: 360, intermediate: 510, advanced: 705, elite: 905 }
    ],
    female: [
      { bodyweight: "114 lbs (52kg)", beginner: 50, novice: 90, intermediate: 145, advanced: 215, elite: 290 },
      { bodyweight: "123 lbs (56kg)", beginner: 60, novice: 105, intermediate: 165, advanced: 245, elite: 330 },
      { bodyweight: "132 lbs (60kg)", beginner: 70, novice: 120, intermediate: 185, advanced: 275, elite: 370 },
      { bodyweight: "148 lbs (67kg)", beginner: 80, novice: 140, intermediate: 215, advanced: 320, elite: 430 },
      { bodyweight: "165 lbs (75kg)", beginner: 95, novice: 160, intermediate: 245, advanced: 365, elite: 490 },
      { bodyweight: "181 lbs (82kg)", beginner: 105, novice: 180, intermediate: 275, advanced: 410, elite: 555 }
    ]
  }
};

export const strengthClassifications = {
  beginner: "0-1 months lifting",
  novice: "1-6 months lifting",
  intermediate: "6-24 months lifting",
  advanced: "2-5 years lifting",
  elite: "5+ years lifting"
};

export default strengthStandards;
