export const regEx = {
  username: /^(?=[a-z_]*\d{0,2}[a-z_]*$)[a-z0-9_]{3,30}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^(\+91[\-\s]?)?[6-9]\d{9}$|^(\+91[\-\s]?)?0\d{2,4}[\-\s]?\d{6,8}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-])[A-Za-z\d!@#$%^&*()_+=-]{8,20}$/,
  name: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøśšùúûüųūýÿżźžÀÁÂÄÃÅĄČĆĘÈÉÊËĖĮÌÍÎÏŁŃÒÓÔÖÕØŚŠÙÚÛÜŲŪÝŸŻŹŽ' -]{1,50}$/
};

export const grainOrFlourTypes = [
  // Grains
  "RICE",            // Common Rice
  "BASMATI_RICE",    // Basmati variety
  "BROWN_RICE",      // Brown rice
  "PARBOILED_RICE",  // Parboiled rice
  "RED_RICE",        // Red rice
  "WHEAT",           // Common wheat
  "BARLEY",          // Barley grain
  "MILLET",          // General millet
  "BAJRA",           // Pearl millet
  "JOWAR",           // Sorghum
  "RAGI",            // Finger millet
  "MAIZE",           // Corn

  // Flours
  "WHEAT_FLOUR",     // Atta
  "RICE_FLOUR",      // Rice flour
  "MAIZE_FLOUR",     // Cornflour
  "BESAN",           // Gram flour (chickpea flour)
  "RAJAGIRA_FLOUR",  // Amaranth flour
  "RAGI_FLOUR",      // Finger millet flour
  "JOWAR_FLOUR",     // Sorghum flour
  "BAJRA_FLOUR",     // Pearl millet flour
  "MAIDA",           // Refined wheat flour
  "SEMOLINA",        // Suji/Rava

  // Pulses (Daal)
  "MOONG_DAAL",      // Green gram
  "MASOOR_DAAL",     // Red lentils
  "URAD_DAAL",       // Black gram
  "CHANA_DAAL",      // Bengal gram
  "TOOR_DAAL",       // Split pigeon peas
  "ARHAR_DAAL",      // Yellow pigeon peas
  "RAJMA",           // Kidney beans
  "KABULI_CHANA",    // Chickpeas
  "LOBIA",           // Black-eyed peas
  "HORSE_GRAM",      // Kulthi

  // Other grains and seeds
  "QUINOA",          // Quinoa
  "AMARANTH",        // Rajgira
  "FLAX_SEEDS",      // Flax seeds
  "SESAME_SEEDS",    // Sesame seeds
  "SOYBEAN",         // Soybean
  "SUNFLOWER_SEEDS", // Sunflower seeds
  "CHIA_SEEDS",      // Chia seeds

  // Miscellaneous
  "POHA",            // Flattened rice
  "SABUDANA",        // Tapioca pearls
  "BROKEN_WHEAT",    // Dalia
  "SOOJI",           // Semolina
  "SAGO",            // Sago pearls (Sabudana)

  // "OTHER"            // For any other types not listed
];

export const cities = [
  "MOHANIA",
  "BHIKHANPUR",
  "GACHIBOWLI",
];
