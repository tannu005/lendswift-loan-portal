/**
 * PIN Code database (sample of 100+ Indian PIN codes covering all states/UTs)
 */
const PIN_CODE_DATA = {
  // Delhi
  "110001": { city: "New Delhi", state: "Delhi", postOffice: "Connaught Place" },
  "110011": { city: "New Delhi", state: "Delhi", postOffice: "Patel Nagar" },
  "110020": { city: "New Delhi", state: "Delhi", postOffice: "Hauz Khas" },
  "110085": { city: "New Delhi", state: "Delhi", postOffice: "Rohini" },
  // Maharashtra
  "400001": { city: "Mumbai", state: "Maharashtra", postOffice: "Fort" },
  "400050": { city: "Mumbai", state: "Maharashtra", postOffice: "Bandra West" },
  "400072": { city: "Mumbai", state: "Maharashtra", postOffice: "Andheri East" },
  "411001": { city: "Pune", state: "Maharashtra", postOffice: "Pune GPO" },
  "411014": { city: "Pune", state: "Maharashtra", postOffice: "Hadapsar" },
  "440001": { city: "Nagpur", state: "Maharashtra", postOffice: "Nagpur GPO" },
  // Karnataka
  "560001": { city: "Bengaluru", state: "Karnataka", postOffice: "Bengaluru GPO" },
  "560034": { city: "Bengaluru", state: "Karnataka", postOffice: "Koramangala" },
  "560066": { city: "Bengaluru", state: "Karnataka", postOffice: "Whitefield" },
  "570001": { city: "Mysuru", state: "Karnataka", postOffice: "Mysuru GPO" },
  // Tamil Nadu
  "600001": { city: "Chennai", state: "Tamil Nadu", postOffice: "Chennai GPO" },
  "600017": { city: "Chennai", state: "Tamil Nadu", postOffice: "T. Nagar" },
  "600032": { city: "Chennai", state: "Tamil Nadu", postOffice: "Adyar" },
  "641001": { city: "Coimbatore", state: "Tamil Nadu", postOffice: "Coimbatore GPO" },
  "625001": { city: "Madurai", state: "Tamil Nadu", postOffice: "Madurai GPO" },
  // Telangana
  "500001": { city: "Hyderabad", state: "Telangana", postOffice: "Hyderabad GPO" },
  "500034": { city: "Hyderabad", state: "Telangana", postOffice: "Jubilee Hills" },
  "500081": { city: "Hyderabad", state: "Telangana", postOffice: "Gachibowli" },
  // Andhra Pradesh
  "520001": { city: "Vijayawada", state: "Andhra Pradesh", postOffice: "Vijayawada GPO" },
  "530001": { city: "Visakhapatnam", state: "Andhra Pradesh", postOffice: "Visakhapatnam GPO" },
  // Gujarat
  "380001": { city: "Ahmedabad", state: "Gujarat", postOffice: "Ahmedabad GPO" },
  "380015": { city: "Ahmedabad", state: "Gujarat", postOffice: "Vastrapur" },
  "395001": { city: "Surat", state: "Gujarat", postOffice: "Surat GPO" },
  "390001": { city: "Vadodara", state: "Gujarat", postOffice: "Vadodara GPO" },
  // Rajasthan
  "302001": { city: "Jaipur", state: "Rajasthan", postOffice: "Jaipur GPO" },
  "302020": { city: "Jaipur", state: "Rajasthan", postOffice: "Malviya Nagar" },
  "342001": { city: "Jodhpur", state: "Rajasthan", postOffice: "Jodhpur GPO" },
  "313001": { city: "Udaipur", state: "Rajasthan", postOffice: "Udaipur GPO" },
  // Uttar Pradesh
  "201301": { city: "Noida", state: "Uttar Pradesh", postOffice: "Noida" },
  "226001": { city: "Lucknow", state: "Uttar Pradesh", postOffice: "Lucknow GPO" },
  "208001": { city: "Kanpur", state: "Uttar Pradesh", postOffice: "Kanpur GPO" },
  "211001": { city: "Prayagraj", state: "Uttar Pradesh", postOffice: "Prayagraj GPO" },
  "221001": { city: "Varanasi", state: "Uttar Pradesh", postOffice: "Varanasi GPO" },
  "250001": { city: "Meerut", state: "Uttar Pradesh", postOffice: "Meerut GPO" },
  "282001": { city: "Agra", state: "Uttar Pradesh", postOffice: "Agra GPO" },
  // West Bengal
  "700001": { city: "Kolkata", state: "West Bengal", postOffice: "Kolkata GPO" },
  "700091": { city: "Kolkata", state: "West Bengal", postOffice: "Salt Lake" },
  "700156": { city: "Kolkata", state: "West Bengal", postOffice: "New Town" },
  // Madhya Pradesh
  "462001": { city: "Bhopal", state: "Madhya Pradesh", postOffice: "Bhopal GPO" },
  "452001": { city: "Indore", state: "Madhya Pradesh", postOffice: "Indore GPO" },
  // Bihar
  "800001": { city: "Patna", state: "Bihar", postOffice: "Patna GPO" },
  "800020": { city: "Patna", state: "Bihar", postOffice: "Boring Road" },
  // Jharkhand
  "834001": { city: "Ranchi", state: "Jharkhand", postOffice: "Ranchi GPO" },
  "831001": { city: "Jamshedpur", state: "Jharkhand", postOffice: "Jamshedpur GPO" },
  // Odisha
  "751001": { city: "Bhubaneswar", state: "Odisha", postOffice: "Bhubaneswar GPO" },
  "753001": { city: "Cuttack", state: "Odisha", postOffice: "Cuttack GPO" },
  // Kerala
  "682001": { city: "Kochi", state: "Kerala", postOffice: "Kochi GPO" },
  "695001": { city: "Thiruvananthapuram", state: "Kerala", postOffice: "Thiruvananthapuram GPO" },
  "673001": { city: "Kozhikode", state: "Kerala", postOffice: "Kozhikode GPO" },
  // Punjab
  "160001": { city: "Chandigarh", state: "Chandigarh", postOffice: "Chandigarh GPO" },
  "141001": { city: "Ludhiana", state: "Punjab", postOffice: "Ludhiana GPO" },
  "143001": { city: "Amritsar", state: "Punjab", postOffice: "Amritsar GPO" },
  // Haryana
  "122001": { city: "Gurugram", state: "Haryana", postOffice: "Gurugram GPO" },
  "132001": { city: "Karnal", state: "Haryana", postOffice: "Karnal GPO" },
  "121001": { city: "Faridabad", state: "Haryana", postOffice: "Faridabad GPO" },
  // Assam
  "781001": { city: "Guwahati", state: "Assam", postOffice: "Guwahati GPO" },
  // Chhattisgarh
  "492001": { city: "Raipur", state: "Chhattisgarh", postOffice: "Raipur GPO" },
  // Goa
  "403001": { city: "Panaji", state: "Goa", postOffice: "Panaji GPO" },
  // Himachal Pradesh
  "171001": { city: "Shimla", state: "Himachal Pradesh", postOffice: "Shimla GPO" },
  // Uttarakhand
  "248001": { city: "Dehradun", state: "Uttarakhand", postOffice: "Dehradun GPO" },
  // Jammu & Kashmir
  "190001": { city: "Srinagar", state: "Jammu and Kashmir", postOffice: "Srinagar GPO" },
  "180001": { city: "Jammu", state: "Jammu and Kashmir", postOffice: "Jammu GPO" },
  // Manipur
  "795001": { city: "Imphal", state: "Manipur", postOffice: "Imphal GPO" },
  // Meghalaya
  "793001": { city: "Shillong", state: "Meghalaya", postOffice: "Shillong GPO" },
  // Nagaland
  "797001": { city: "Kohima", state: "Nagaland", postOffice: "Kohima GPO" },
  // Tripura
  "799001": { city: "Agartala", state: "Tripura", postOffice: "Agartala GPO" },
  // Mizoram
  "796001": { city: "Aizawl", state: "Mizoram", postOffice: "Aizawl GPO" },
  // Arunachal Pradesh
  "791001": { city: "Itanagar", state: "Arunachal Pradesh", postOffice: "Itanagar GPO" },
  // Sikkim
  "737101": { city: "Gangtok", state: "Sikkim", postOffice: "Gangtok GPO" },
  // Ladakh
  "194101": { city: "Leh", state: "Ladakh", postOffice: "Leh GPO" },
  // Puducherry
  "605001": { city: "Puducherry", state: "Puducherry", postOffice: "Puducherry GPO" },
  // Andaman & Nicobar
  "744101": { city: "Port Blair", state: "Andaman and Nicobar Islands", postOffice: "Port Blair GPO" },
  // Lakshadweep
  "682555": { city: "Kavaratti", state: "Lakshadweep", postOffice: "Kavaratti GPO" },
  // Additional common PINs
  "201001": { city: "Ghaziabad", state: "Uttar Pradesh", postOffice: "Ghaziabad GPO" },
  "421001": { city: "Thane", state: "Maharashtra", postOffice: "Thane GPO" },
  "500032": { city: "Secunderabad", state: "Telangana", postOffice: "Secunderabad GPO" },
  "560100": { city: "Bengaluru", state: "Karnataka", postOffice: "Electronic City" },
  "600028": { city: "Chennai", state: "Tamil Nadu", postOffice: "Velachery" },
  "700064": { city: "Kolkata", state: "West Bengal", postOffice: "Behala" },
  "560038": { city: "Bengaluru", state: "Karnataka", postOffice: "Indiranagar" },
  "400076": { city: "Mumbai", state: "Maharashtra", postOffice: "Powai" },
  "110016": { city: "New Delhi", state: "Delhi", postOffice: "Hauz Khas Enclave" },
  "110019": { city: "New Delhi", state: "Delhi", postOffice: "Nehru Place" },
  "110048": { city: "New Delhi", state: "Delhi", postOffice: "Lajpat Nagar" },
  "110065": { city: "New Delhi", state: "Delhi", postOffice: "Andrews Ganj" },
  "122002": { city: "Gurugram", state: "Haryana", postOffice: "DLF Phase 1" },
  "201304": { city: "Greater Noida", state: "Uttar Pradesh", postOffice: "Greater Noida" },
  "560078": { city: "Bengaluru", state: "Karnataka", postOffice: "HSR Layout" },
  "411006": { city: "Pune", state: "Maharashtra", postOffice: "Deccan Gymkhana" },
  "380009": { city: "Ahmedabad", state: "Gujarat", postOffice: "Navrangpura" },
  "600096": { city: "Chennai", state: "Tamil Nadu", postOffice: "Sholinganallur" },
  "500008": { city: "Hyderabad", state: "Telangana", postOffice: "Banjara Hills" },
  "226010": { city: "Lucknow", state: "Uttar Pradesh", postOffice: "Gomti Nagar" },
  "302017": { city: "Jaipur", state: "Rajasthan", postOffice: "Jagatpura" },
  "641014": { city: "Coimbatore", state: "Tamil Nadu", postOffice: "RS Puram" },
  "682024": { city: "Kochi", state: "Kerala", postOffice: "Kakkanad" },
};

export default PIN_CODE_DATA;
