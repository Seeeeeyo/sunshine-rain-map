// Constants for data ranges and thresholds
const CITY_POPULATION_THRESHOLD = 100000; // Only include cities above this population

class CityDataService {
    constructor() {
        this.countries = new Map();
        this.isLoading = false;
        this.error = null;
        
        // Initialize complete rainfall data from the database
        this.rainfallData = new Map([
            ['Colombia', 3240], ['São Tomé and Príncipe', 3200], ['Tuvalu', 3200],
            ['Papua New Guinea', 3142], ['Solomon Islands', 3028], ['Panama', 2928],
            ['Costa Rica', 2926], ['Samoa', 2880], ['Malaysia', 2875], ['Brunei', 2722],
            ['Indonesia', 2702], ['Bangladesh', 2666], ['Fiji', 2592], ['Sierra Leone', 2526],
            ['Singapore', 2497], ['Liberia', 2391], ['Guyana', 2387], ['Grenada', 2350],
            ['Philippines', 2348], ['Suriname', 2331], ['Seychelles', 2330], ['Saint Lucia', 2301],
            ['Nicaragua', 2280], ['Ecuador', 2274], ['Bhutan', 2200], ['Trinidad and Tobago', 2200],
            ['Equatorial Guinea', 2156], ['Myanmar', 2091], ['Dominica', 2083],
            ['Jamaica', 2051], ['Venezuela', 2044], ['Mauritius', 2041], ['Vanuatu', 2000],
            ['Guatemala', 1996], ['Honduras', 1976], ['Maldives', 1972], ['Iceland', 1940],
            ['Cambodia', 1904], ['Laos', 1834], ['Gabon', 1831], ['Vietnam', 1821],
            ['El Salvador', 1784], ['Brazil', 1761], ['Peru', 1738], ['New Zealand', 1732],
            ['Sri Lanka', 1712], ['Belize', 1705], ['Japan', 1668], ['Guinea', 1651],
            ['Congo', 1646], ['Thailand', 1622], ['Cameroon', 1604],
            ['Saint Vincent and the Grenadines', 1583], ['Guinea-Bissau', 1577],
            ['DR Congo', 1543], ['Switzerland', 1537], ['Chile', 1522], ['Madagascar', 1513],
            ['East Timor', 1500], ['Nepal', 1500], ['Albania', 1485], ['Haiti', 1440],
            ['Saint Kitts and Nevis', 1427], ['Barbados', 1422], ['Norway', 1414],
            ['Dominican Republic', 1410], ['Ivory Coast', 1348], ['Central African Republic', 1343],
            ['Cuba', 1335], ['Uruguay', 1300], ['Bahamas', 1292], ['Burundi', 1274],
            ['South Korea', 1274], ['United Kingdom', 1220], ['Rwanda', 1212], ['Ghana', 1187],
            ['Malawi', 1181], ['Uganda', 1180], ['Togo', 1168], ['Slovenia', 1162],
            ['Nigeria', 1150], ['Bolivia', 1146], ['Paraguay', 1130], ['Ireland', 1118],
            ['Croatia', 1113], ['Austria', 1110], ['India', 1083], ['Tanzania', 1071],
            ['North Korea', 1054], ['Benin', 1039], ['Mozambique', 1032],
            ['Bosnia and Herzegovina', 1028], ['Georgia', 1026], ['Zambia', 1020],
            ['Angola', 1010], ['Luxembourg', 934], ['France', 867], ['Portugal', 854],
            ['Ethiopia', 848], ['Belgium', 847], ['Gambia', 836], ['Italy', 832],
            ['Slovakia', 824], ['Eswatini', 788], ['Lesotho', 788], ['Netherlands', 778],
            ['Mexico', 758], ['Burkina Faso', 748], ['United States', 715], ['Denmark', 703],
            ['Germany', 700], ['Tajikistan', 691], ['Senegal', 686], ['Czech Republic', 677],
            ['Latvia', 667], ['Lebanon', 661], ['Zimbabwe', 657], ['Lithuania', 656],
            ['Greece', 652], ['China', 645], ['Romania', 637], ['Spain', 636],
            ['Kenya', 630], ['Estonia', 626], ['Sweden', 624], ['North Macedonia', 619],
            ['Belarus', 618], ['Bulgaria', 608], ['Poland', 600], ['Turkey', 593],
            ['Argentina', 591], ['Hungary', 589], ['Ukraine', 565], ['Armenia', 562],
            ['Malta', 560], ['Canada', 537], ['Finland', 536], ['Australia', 534],
            ['Kyrgyzstan', 533], ['Cyprus', 498], ['South Africa', 495], ['Pakistan', 494],
            ['Russia', 460], ['Moldova', 450], ['Azerbaijan', 447], ['Israel', 435],
            ['Botswana', 416], ['Palestine', 402], ['Eritrea', 384], ['Morocco', 346],
            ['Afghanistan', 327], ['Chad', 322], ['Namibia', 285], ['Mali', 282],
            ['Somalia', 282], ['Syria', 252], ['Kazakhstan', 250], ['Sudan', 250],
            ['Mongolia', 241], ['Cape Verde', 228], ['Iran', 228], ['Djibouti', 220],
            ['Iraq', 216], ['Tunisia', 207], ['Uzbekistan', 206], ['Yemen', 167],
            ['Turkmenistan', 161], ['Niger', 151], ['Oman', 125], ['Kuwait', 121],
            ['Jordan', 111], ['Mauritania', 92], ['Algeria', 89], ['Bahrain', 83],
            ['United Arab Emirates', 78], ['Qatar', 74], ['Saudi Arabia', 59],
            ['Libya', 56], ['Egypt', 18]
        ]);

        // Initialize coordinates for all countries
        this.coordinates = new Map([
            // Europe
            ['Albania', { lat: 41.1533, lng: 20.1683, region: 'Europe' }],
            ['Andorra', { lat: 42.5063, lng: 1.5218, region: 'Europe' }],
            ['Austria', { lat: 47.5162, lng: 14.5501, region: 'Europe' }],
            ['Belarus', { lat: 53.7098, lng: 27.9534, region: 'Europe' }],
            ['Belgium', { lat: 50.8503, lng: 4.3517, region: 'Europe' }],
            ['Bosnia and Herzegovina', { lat: 43.9159, lng: 17.6791, region: 'Europe' }],
            ['Bulgaria', { lat: 42.7339, lng: 25.4858, region: 'Europe' }],
            ['Croatia', { lat: 45.1000, lng: 15.2000, region: 'Europe' }],
            ['Czech Republic', { lat: 49.8175, lng: 15.473, region: 'Europe' }],
            ['Denmark', { lat: 56.2639, lng: 9.5018, region: 'Europe' }],
            ['Estonia', { lat: 58.5953, lng: 25.0136, region: 'Europe' }],
            ['Finland', { lat: 61.9241, lng: 25.7482, region: 'Europe' }],
            ['France', { lat: 46.2276, lng: 2.2137, region: 'Europe' }],
            ['Germany', { lat: 51.1657, lng: 10.4515, region: 'Europe' }],
            ['Greece', { lat: 39.0742, lng: 21.8243, region: 'Europe' }],
            ['Hungary', { lat: 47.1625, lng: 19.5033, region: 'Europe' }],
            ['Iceland', { lat: 64.9631, lng: -19.0208, region: 'Europe' }],
            ['Ireland', { lat: 53.1424, lng: -7.6921, region: 'Europe' }],
            ['Italy', { lat: 41.8719, lng: 12.5674, region: 'Europe' }],
            ['Latvia', { lat: 56.8796, lng: 24.6032, region: 'Europe' }],
            ['Liechtenstein', { lat: 47.1660, lng: 9.5554, region: 'Europe' }],
            ['Lithuania', { lat: 55.1694, lng: 23.8813, region: 'Europe' }],
            ['Luxembourg', { lat: 49.8153, lng: 6.1296, region: 'Europe' }],
            ['Malta', { lat: 35.9375, lng: 14.3754, region: 'Europe' }],
            ['Moldova', { lat: 47.4116, lng: 28.3699, region: 'Europe' }],
            ['Monaco', { lat: 43.7384, lng: 7.4246, region: 'Europe' }],
            ['Montenegro', { lat: 42.7087, lng: 19.3744, region: 'Europe' }],
            ['Netherlands', { lat: 52.1326, lng: 5.2913, region: 'Europe' }],
            ['North Macedonia', { lat: 41.6086, lng: 21.7453, region: 'Europe' }],
            ['Norway', { lat: 60.4720, lng: 8.4689, region: 'Europe' }],
            ['Poland', { lat: 51.9194, lng: 19.1451, region: 'Europe' }],
            ['Portugal', { lat: 39.3999, lng: -8.2245, region: 'Europe' }],
            ['Romania', { lat: 45.9432, lng: 24.9668, region: 'Europe' }],
            ['Russia', { lat: 61.5240, lng: 105.3188, region: 'Europe-Asia' }],
            ['San Marino', { lat: 43.9424, lng: 12.4578, region: 'Europe' }],
            ['Serbia', { lat: 44.0165, lng: 21.0059, region: 'Europe' }],
            ['Slovakia', { lat: 48.6690, lng: 19.699, region: 'Europe' }],
            ['Slovenia', { lat: 46.1512, lng: 14.9955, region: 'Europe' }],
            ['Spain', { lat: 40.4637, lng: -3.7492, region: 'Europe' }],
            ['Sweden', { lat: 60.1282, lng: 18.6435, region: 'Europe' }],
            ['Switzerland', { lat: 46.8182, lng: 8.2275, region: 'Europe' }],
            ['Ukraine', { lat: 48.3794, lng: 31.1656, region: 'Europe' }],
            ['United Kingdom', { lat: 55.3781, lng: -3.4360, region: 'Europe' }],
            ['Vatican City', { lat: 41.9029, lng: 12.4534, region: 'Europe' }],

            // Asia
            ['Afghanistan', { lat: 33.9391, lng: 67.7100, region: 'Asia' }],
            ['Armenia', { lat: 40.0691, lng: 45.0382, region: 'Asia' }],
            ['Azerbaijan', { lat: 40.1431, lng: 47.5769, region: 'Asia' }],
            ['Bahrain', { lat: 26.0667, lng: 50.5577, region: 'Asia' }],
            ['Bangladesh', { lat: 23.6850, lng: 90.3563, region: 'Asia' }],
            ['Bhutan', { lat: 27.5142, lng: 90.4336, region: 'Asia' }],
            ['Brunei', { lat: 4.5353, lng: 114.7277, region: 'Asia' }],
            ['Cambodia', { lat: 12.5657, lng: 104.9910, region: 'Asia' }],
            ['China', { lat: 35.8617, lng: 104.1954, region: 'Asia' }],
            ['Cyprus', { lat: 35.1264, lng: 33.4299, region: 'Asia' }],
            ['Georgia', { lat: 42.3154, lng: 43.3569, region: 'Asia' }],
            ['India', { lat: 20.5937, lng: 78.9629, region: 'Asia' }],
            ['Indonesia', { lat: -0.7893, lng: 113.9213, region: 'Asia' }],
            ['Iran', { lat: 32.4279, lng: 53.6880, region: 'Asia' }],
            ['Iraq', { lat: 33.2232, lng: 43.6793, region: 'Asia' }],
            ['Israel', { lat: 31.0461, lng: 34.8516, region: 'Asia' }],
            ['Japan', { lat: 36.2048, lng: 138.2529, region: 'Asia' }],
            ['Jordan', { lat: 30.5852, lng: 36.2384, region: 'Asia' }],
            ['Kazakhstan', { lat: 48.0196, lng: 66.9237, region: 'Asia' }],
            ['Kuwait', { lat: 29.3117, lng: 47.4818, region: 'Asia' }],
            ['Kyrgyzstan', { lat: 41.2044, lng: 74.7661, region: 'Asia' }],
            ['Laos', { lat: 19.8563, lng: 102.4955, region: 'Asia' }],
            ['Lebanon', { lat: 33.8547, lng: 35.8623, region: 'Asia' }],
            ['Malaysia', { lat: 4.2105, lng: 101.9758, region: 'Asia' }],
            ['Maldives', { lat: 3.2028, lng: 73.2207, region: 'Asia' }],
            ['Mongolia', { lat: 46.8625, lng: 103.8467, region: 'Asia' }],
            ['Myanmar', { lat: 21.9162, lng: 95.9560, region: 'Asia' }],
            ['Nepal', { lat: 28.3949, lng: 84.1240, region: 'Asia' }],
            ['North Korea', { lat: 40.3399, lng: 127.5101, region: 'Asia' }],
            ['Oman', { lat: 21.4735, lng: 55.9754, region: 'Asia' }],
            ['Pakistan', { lat: 30.3753, lng: 69.3451, region: 'Asia' }],
            ['Palestine', { lat: 31.9522, lng: 35.2332, region: 'Asia' }],
            ['Philippines', { lat: 12.8797, lng: 121.7740, region: 'Asia' }],
            ['Qatar', { lat: 25.3548, lng: 51.1839, region: 'Asia' }],
            ['Saudi Arabia', { lat: 23.8859, lng: 45.0792, region: 'Asia' }],
            ['Singapore', { lat: 1.3521, lng: 103.8198, region: 'Asia' }],
            ['South Korea', { lat: 35.9078, lng: 127.7669, region: 'Asia' }],
            ['Sri Lanka', { lat: 7.8731, lng: 80.7718, region: 'Asia' }],
            ['Syria', { lat: 34.8021, lng: 38.9968, region: 'Asia' }],
            ['Taiwan', { lat: 23.5937, lng: 120.9605, region: 'Asia' }],
            ['Tajikistan', { lat: 38.8610, lng: 71.2761, region: 'Asia' }],
            ['Thailand', { lat: 15.8700, lng: 100.9925, region: 'Asia' }],
            ['Timor-Leste', { lat: -8.8742, lng: 125.7275, region: 'Asia' }],
            ['Turkey', { lat: 38.9637, lng: 35.2433, region: 'Asia' }],
            ['Turkmenistan', { lat: 38.9697, lng: 59.5563, region: 'Asia' }],
            ['United Arab Emirates', { lat: 23.4241, lng: 53.8478, region: 'Asia' }],
            ['Uzbekistan', { lat: 41.3775, lng: 64.5853, region: 'Asia' }],
            ['Vietnam', { lat: 14.0583, lng: 108.2772, region: 'Asia' }],
            ['Yemen', { lat: 15.5527, lng: 48.5164, region: 'Asia' }],

            // North America
            ['Antigua and Barbuda', { lat: 17.0608, lng: -61.7964, region: 'North America' }],
            ['Bahamas', { lat: 25.0343, lng: -77.3963, region: 'North America' }],
            ['Barbados', { lat: 13.1939, lng: -59.5432, region: 'North America' }],
            ['Belize', { lat: 17.1899, lng: -88.4976, region: 'North America' }],
            ['Canada', { lat: 56.1304, lng: -106.3468, region: 'North America' }],
            ['Costa Rica', { lat: 9.7489, lng: -83.7534, region: 'North America' }],
            ['Cuba', { lat: 21.5218, lng: -77.7812, region: 'North America' }],
            ['Dominica', { lat: 15.4150, lng: -61.3710, region: 'North America' }],
            ['Dominican Republic', { lat: 18.7357, lng: -70.1627, region: 'North America' }],
            ['El Salvador', { lat: 13.7942, lng: -88.8965, region: 'North America' }],
            ['Grenada', { lat: 12.1165, lng: -61.6790, region: 'North America' }],
            ['Guatemala', { lat: 15.7835, lng: -90.2308, region: 'North America' }],
            ['Haiti', { lat: 18.9712, lng: -72.2852, region: 'North America' }],
            ['Honduras', { lat: 15.1991, lng: -86.2419, region: 'North America' }],
            ['Jamaica', { lat: 18.1096, lng: -77.2975, region: 'North America' }],
            ['Mexico', { lat: 23.6345, lng: -102.5528, region: 'North America' }],
            ['Nicaragua', { lat: 12.8654, lng: -85.2072, region: 'North America' }],
            ['Panama', { lat: 8.5380, lng: -80.7821, region: 'North America' }],
            ['Saint Kitts and Nevis', { lat: 17.3578, lng: -62.7830, region: 'North America' }],
            ['Saint Lucia', { lat: 13.9094, lng: -60.9789, region: 'North America' }],
            ['Saint Vincent and the Grenadines', { lat: 13.2528, lng: -61.1971, region: 'North America' }],
            ['Trinidad and Tobago', { lat: 10.6918, lng: -61.2225, region: 'North America' }],
            ['United States', { lat: 37.0902, lng: -95.7129, region: 'North America' }],

            // South America
            ['Argentina', { lat: -38.4161, lng: -63.6167, region: 'South America' }],
            ['Bolivia', { lat: -16.2902, lng: -63.5887, region: 'South America' }],
            ['Brazil', { lat: -14.2350, lng: -51.9253, region: 'South America' }],
            ['Chile', { lat: -35.6751, lng: -71.5430, region: 'South America' }],
            ['Colombia', { lat: 4.5709, lng: -74.2973, region: 'South America' }],
            ['Ecuador', { lat: -1.8312, lng: -78.1834, region: 'South America' }],
            ['Guyana', { lat: 4.8604, lng: -58.9302, region: 'South America' }],
            ['Paraguay', { lat: -23.4425, lng: -58.4438, region: 'South America' }],
            ['Peru', { lat: -9.1900, lng: -75.0152, region: 'South America' }],
            ['Suriname', { lat: 3.9193, lng: -56.0278, region: 'South America' }],
            ['Uruguay', { lat: -32.5228, lng: -55.7658, region: 'South America' }],
            ['Venezuela', { lat: 6.4238, lng: -66.5897, region: 'South America' }],

            // Africa
            ['Algeria', { lat: 36.7538, lng: 3.0588, region: 'Africa' }],
            ['Angola', { lat: -11.2027, lng: 17.8739, region: 'Africa' }],
            ['Benin', { lat: 9.3077, lng: 2.3158, region: 'Africa' }],
            ['Botswana', { lat: -22.3285, lng: 24.6849, region: 'Africa' }],
            ['Burkina Faso', { lat: 12.2383, lng: -1.5616, region: 'Africa' }],
            ['Burundi', { lat: -3.3731, lng: 29.9189, region: 'Africa' }],
            ['Cameroon', { lat: 7.3697, lng: 12.3547, region: 'Africa' }],
            ['Cape Verde', { lat: 16.5388, lng: -23.0418, region: 'Africa' }],
            ['Central African Republic', { lat: 6.6111, lng: 20.9394, region: 'Africa' }],
            ['Chad', { lat: 15.4542, lng: 18.7322, region: 'Africa' }],
            ['Comoros', { lat: -11.6455, lng: 43.3333, region: 'Africa' }],
            ['Congo', { lat: -0.2280, lng: 15.8277, region: 'Africa' }],
            ['DR Congo', { lat: -4.0383, lng: 21.7587, region: 'Africa' }],
            ['Djibouti', { lat: 11.8251, lng: 42.5903, region: 'Africa' }],
            ['Egypt', { lat: 26.8206, lng: 30.8025, region: 'Africa' }],
            ['Equatorial Guinea', { lat: 1.6508, lng: 10.2679, region: 'Africa' }],
            ['Eritrea', { lat: 15.1794, lng: 39.7823, region: 'Africa' }],
            ['Eswatini', { lat: -26.5225, lng: 31.4659, region: 'Africa' }],
            ['Ethiopia', { lat: 9.1450, lng: 40.4897, region: 'Africa' }],
            ['Gabon', { lat: -0.8037, lng: 11.6094, region: 'Africa' }],
            ['Gambia', { lat: 13.4432, lng: -15.3101, region: 'Africa' }],
            ['Ghana', { lat: 7.9465, lng: -1.0232, region: 'Africa' }],
            ['Guinea', { lat: 9.9456, lng: -9.6966, region: 'Africa' }],
            ['Guinea-Bissau', { lat: 11.8037, lng: -15.1804, region: 'Africa' }],
            ['Ivory Coast', { lat: 7.5400, lng: -5.5471, region: 'Africa' }],
            ['Kenya', { lat: -0.0236, lng: 37.9062, region: 'Africa' }],
            ['Lesotho', { lat: -29.6100, lng: 28.2336, region: 'Africa' }],
            ['Liberia', { lat: 6.4281, lng: -9.4295, region: 'Africa' }],
            ['Libya', { lat: 26.3351, lng: 17.2283, region: 'Africa' }],
            ['Madagascar', { lat: -18.7669, lng: 46.8691, region: 'Africa' }],
            ['Malawi', { lat: -13.2543, lng: 34.3015, region: 'Africa' }],
            ['Mali', { lat: 17.5707, lng: -3.9962, region: 'Africa' }],
            ['Mauritania', { lat: 21.0079, lng: -10.9408, region: 'Africa' }],
            ['Mauritius', { lat: -20.3484, lng: 57.5522, region: 'Africa' }],
            ['Morocco', { lat: 31.7917, lng: -7.0926, region: 'Africa' }],
            ['Mozambique', { lat: -18.6657, lng: 35.5296, region: 'Africa' }],
            ['Namibia', { lat: -22.9576, lng: 18.4904, region: 'Africa' }],
            ['Niger', { lat: 17.6078, lng: 8.0817, region: 'Africa' }],
            ['Nigeria', { lat: 9.0820, lng: 8.6753, region: 'Africa' }],
            ['Rwanda', { lat: -1.9403, lng: 29.8739, region: 'Africa' }],
            ['São Tomé and Príncipe', { lat: 0.1864, lng: 6.6131, region: 'Africa' }],
            ['Senegal', { lat: 14.4974, lng: -14.4524, region: 'Africa' }],
            ['Seychelles', { lat: -4.6796, lng: 55.4920, region: 'Africa' }],
            ['Sierra Leone', { lat: 8.4606, lng: -11.7799, region: 'Africa' }],
            ['Somalia', { lat: 5.1521, lng: 46.1996, region: 'Africa' }],
            ['South Africa', { lat: -30.5595, lng: 22.9375, region: 'Africa' }],
            ['South Sudan', { lat: 6.8770, lng: 31.3070, region: 'Africa' }],
            ['Sudan', { lat: 12.8628, lng: 30.2176, region: 'Africa' }],
            ['Tanzania', { lat: -6.3690, lng: 34.8888, region: 'Africa' }],
            ['Togo', { lat: 8.6195, lng: 0.8248, region: 'Africa' }],
            ['Tunisia', { lat: 33.8869, lng: 9.5375, region: 'Africa' }],
            ['Uganda', { lat: 1.3733, lng: 32.2903, region: 'Africa' }],
            ['Zambia', { lat: -13.1339, lng: 27.8493, region: 'Africa' }],
            ['Zimbabwe', { lat: -19.0154, lng: 29.1549, region: 'Africa' }],

            // Oceania
            ['Australia', { lat: -25.2744, lng: 133.7751, region: 'Oceania' }],
            ['Fiji', { lat: -17.7134, lng: 178.0650, region: 'Oceania' }],
            ['Kiribati', { lat: -3.3704, lng: -168.7340, region: 'Oceania' }],
            ['Marshall Islands', { lat: 7.1315, lng: 171.1845, region: 'Oceania' }],
            ['Micronesia', { lat: 7.4256, lng: 150.5508, region: 'Oceania' }],
            ['Nauru', { lat: -0.5228, lng: 166.9315, region: 'Oceania' }],
            ['New Zealand', { lat: -40.9006, lng: 174.8860, region: 'Oceania' }],
            ['Palau', { lat: 7.5150, lng: 134.5825, region: 'Oceania' }],
            ['Papua New Guinea', { lat: -6.3149, lng: 143.9555, region: 'Oceania' }],
            ['Samoa', { lat: -13.7590, lng: -172.1046, region: 'Oceania' }],
            ['Solomon Islands', { lat: -9.6457, lng: 160.1562, region: 'Oceania' }],
            ['Tonga', { lat: -21.1789, lng: -175.1982, region: 'Oceania' }],
            ['Tuvalu', { lat: -7.1095, lng: 177.6493, region: 'Oceania' }],
            ['Vanuatu', { lat: -15.3767, lng: 166.9592, region: 'Oceania' }]
        ]);
    }

    processSunshineData() {
        const sunshineByCountry = new Map();
        const cityCounts = new Map();

        // Process each city's sunshine data and accumulate by country
        [
            // Africa
            ['Algeria', 'Algiers', 2847], ['Algeria', 'Tamanrasset', 3686],
            ['Angola', 'Luanda', 2341],
            ['Benin', 'Cotonou', 2345], ['Benin', 'Parakou', 2501], ['Benin', 'Kandi', 3045],
            ['Botswana', 'Maun', 3330], ['Botswana', 'Gaborone', 3371], ['Botswana', 'Ghanzi', 3579],
            ['Burkina Faso', 'Ouagadougou', 3136], ['Burkina Faso', 'Ouahigouya', 3282],
            ['Burundi', 'Bujumbura', 2373],
            ['Cameroon', 'Garoua', 2927], ['Cameroon', 'N\'Gaoundéré', 2471], 
            ['Cameroon', 'Douala', 1618], ['Cameroon', 'Yaoundé', 1644],
            ['Central African Republic', 'Bangui', 2095], ['Central African Republic', 'Birao', 2998],
            ['Chad', 'N\'Djamena', 3206], ['Chad', 'Abéché', 3501],
            ['Congo', 'Brazzaville', 1915], ['Congo', 'Pointe-Noire', 1574], ['Congo', 'Dolisie', 1607],
            ['DR Congo', 'Kinshasa', 1672], ['DR Congo', 'Lubumbashi', 2778],
            ['Djibouti', 'Djibouti City', 3279],
            ['Egypt', 'Alexandria', 3580], ['Egypt', 'Cairo', 3542], 
            ['Egypt', 'Dakhla Oasis', 3943], ['Egypt', 'Hurghada', 3531], ['Egypt', 'Marsa Alam', 3958],
            ['Equatorial Guinea', 'Bata', 1921], ['Equatorial Guinea', 'Malabo', 1177],
            ['Eritrea', 'Asmara', 3361],
            ['Ethiopia', 'Mekelle', 3129], ['Ethiopia', 'Addis Abeba', 2440],
            ['Gabon', 'Libreville', 1717], ['Gabon', 'Port-Gentil', 1724],
            ['Gambia', 'Banjul', 3070],
            ['Ghana', 'Accra', 2432], ['Ghana', 'Tamale', 2719], ['Ghana', 'Kumasi', 1952],
            ['Guinea', 'Conakry', 2222], ['Guinea', 'Kankan', 2658],
            ['Guinea-Bissau', 'Bissau', 2707],
            ['Ivory Coast', 'Gagnoa', 1823], ['Ivory Coast', 'Bouaké', 2092],
            ['Ivory Coast', 'Abidjan', 2296], ['Ivory Coast', 'Odienné', 2639], ['Ivory Coast', 'Ferké', 2757],
            ['Kenya', 'Mombasa', 2932], ['Kenya', 'Nairobi', 2492],
            ['Kenya', 'Garissa', 3114], ['Kenya', 'Lodwar', 3582],
            ['Libya', 'Tripoli', 3187], ['Libya', 'Benghazi', 3169],
            
            // Europe
            ['United Kingdom', 'London', 1633],
            ['Spain', 'Madrid', 2769],
            ['France', 'Paris', 1662],
            ['Germany', 'Berlin', 1626],
            ['Italy', 'Rome', 2473],
            ['Russia', 'Moscow', 1901],
            ['Belgium', 'Brussels', 1546],
            ['Netherlands', 'Amsterdam', 1662],
            ['Norway', 'Oslo', 1668],
            ['Sweden', 'Stockholm', 1803],
            ['Finland', 'Helsinki', 1858],
            
            // Asia
            ['China', 'Beijing', 2671],
            ['Japan', 'Tokyo', 1877],
            ['India', 'New Delhi', 2685],
            ['Singapore', 'Singapore', 2022],
            ['Thailand', 'Bangkok', 2624],
            ['Vietnam', 'Hanoi', 1585],
            ['Malaysia', 'Kuala Lumpur', 2222],
            ['Indonesia', 'Jakarta', 2483],
            ['Philippines', 'Manila', 2103],
            
            // Americas
            ['United States', 'Phoenix', 3872], ['United States', 'Las Vegas', 3825],
            ['United States', 'Miami', 3154], ['United States', 'Los Angeles', 3254],
            ['United States', 'Denver', 3107], ['United States', 'Houston', 2578],
            ['United States', 'Chicago', 2508], ['United States', 'New York', 2535],
            ['Canada', 'Toronto', 2066], ['Canada', 'Vancouver', 1938],
            ['Canada', 'Montreal', 2051], ['Canada', 'Calgary', 2396],
            ['Mexico', 'Mexico City', 2555], ['Mexico', 'Cancun', 2768],
            ['Mexico', 'Monterrey', 2821], ['Mexico', 'Guadalajara', 2586],

            // Caribbean
            ['Cuba', 'Havana', 2829], ['Dominican Republic', 'Santo Domingo', 2580],
            ['Jamaica', 'Kingston', 2751], ['Puerto Rico', 'San Juan', 3154],

            // Central America
            ['Panama', 'Panama City', 2517], ['Costa Rica', 'San José', 2338],
            ['Guatemala', 'Guatemala City', 2442], ['Honduras', 'Tegucigalpa', 2362],
            ['El Salvador', 'San Salvador', 2555], ['Nicaragua', 'Managua', 2761],

            // South America
            ['Brazil', 'Rio de Janeiro', 2187], ['Brazil', 'São Paulo', 1894],
            ['Brazil', 'Brasília', 2368], ['Brazil', 'Salvador', 2443],
            ['Brazil', 'Fortaleza', 2804], ['Brazil', 'Manaus', 1775],
            ['Argentina', 'Buenos Aires', 2525], ['Argentina', 'Córdoba', 2534],
            ['Argentina', 'Mendoza', 2872], ['Argentina', 'Salta', 1827],
            ['Colombia', 'Bogota', 1328], ['Colombia', 'Medellín', 1892],
            ['Colombia', 'Barranquilla', 2561], ['Colombia', 'Cali', 1942],
            ['Peru', 'Lima', 1230], ['Peru', 'Arequipa', 3333],
            ['Peru', 'Iquitos', 2180], ['Chile', 'Santiago', 2808],
            ['Chile', 'Antofagasta', 3077], ['Chile', 'Calama', 3926],
            ['Venezuela', 'Caracas', 2507], ['Venezuela', 'Maracaibo', 3284],
            ['Ecuador', 'Quito', 2238], ['Ecuador', 'Guayaquil', 1581],
            ['Paraguay', 'Asunción', 2803], ['Uruguay', 'Montevideo', 2481],

            // Africa (continued)
            ['Madagascar', 'Antananarivo', 2626], ['Madagascar', 'Toamasina', 2410],
            ['Madagascar', 'Mahajanga', 3223], ['Madagascar', 'Toliara', 3610],
            ['Malawi', 'Karonga', 3000], ['Malawi', 'Blantyre', 2797], ['Malawi', 'Mzuzu', 2591],
            ['Mali', 'Bamako', 2954], ['Mali', 'Timbuktu', 3107], ['Mali', 'Ségou', 3239],
            ['Mauritania', 'Nouakchott', 3333], ['Mauritania', 'Nouadhibou', 3332],
            ['Morocco', 'Rabat', 2919], ['Morocco', 'Marrakech', 3131], ['Morocco', 'Ouarzazate', 3416],
            ['Mozambique', 'Maputo', 2838],
            ['Namibia', 'Windhoek', 3605], ['Namibia', 'Keetmanshoop', 3870],
            ['South Africa', 'Cape Town', 3094], ['South Africa', 'Johannesburg', 3124],
            ['Tanzania', 'Dar es Salaam', 2791], ['Tanzania', 'Dodoma', 2801],
            ['Tunisia', 'Tunis', 2808], ['Tunisia', 'Sfax', 2921],
            ['Uganda', 'Kampala', 2365], ['Uganda', 'Entebbe', 2524],
            ['Zambia', 'Lusaka', 2728], ['Zambia', 'Ndola', 2913],
            ['Zimbabwe', 'Harare', 2847], ['Zimbabwe', 'Bulawayo', 3089],

            // Oceania
            ['Australia', 'Sydney', 2468], ['Australia', 'Melbourne', 2363],
            ['Australia', 'Brisbane', 2968], ['Australia', 'Perth', 3230],
            ['Australia', 'Darwin', 3092], ['Australia', 'Adelaide', 2765],
            ['Australia', 'Hobart', 2393], ['Australia', 'Canberra', 2814],
            ['New Zealand', 'Auckland', 2003], ['New Zealand', 'Wellington', 2059],
            ['New Zealand', 'Christchurch', 2070], ['New Zealand', 'Dunedin', 1684],
            ['Papua New Guinea', 'Port Moresby', 2463],
            ['Solomon Islands', 'Honiara', 2330],
            ['Fiji', 'Suva', 1922],
            ['Samoa', 'Apia', 2280],
            ['Vanuatu', 'Port Vila', 2330]
        ].forEach(([country, city, sunshine]) => {
            if (!sunshineByCountry.has(country)) {
                sunshineByCountry.set(country, 0);
                cityCounts.set(country, 0);
            }
            sunshineByCountry.set(country, sunshineByCountry.get(country) + sunshine);
            cityCounts.set(country, cityCounts.get(country) + 1);
        });

        // Calculate averages
        const sunshineData = new Map();
        sunshineByCountry.forEach((total, country) => {
            const average = Math.round(total / cityCounts.get(country));
            sunshineData.set(country, average);
        });

        return sunshineData;
    }

    async initialize() {
        try {
            this.isLoading = true;
            const countryData = this.combineCountryData();
            countryData.forEach(country => {
                this.countries.set(country.name, country);
            });
        } catch (error) {
            this.error = error;
            console.error('Failed to load country data:', error);
        } finally {
            this.isLoading = false;
        }
    }

    combineCountryData() {
        const sunshineData = this.processSunshineData();
        const combinedData = [];

        this.coordinates.forEach((coords, countryName) => {
            const rainfall = this.rainfallData.get(countryName) || 0;
            const sunshine = sunshineData.get(countryName) || 
                           this.estimateSunshineHours(coords.lat);

            combinedData.push({
                name: countryName,
                lat: coords.lat,
                lng: coords.lng,
                sunshine: sunshine,
                rain: rainfall,
                region: coords.region
            });
        });

        return combinedData;
    }

    estimateSunshineHours(latitude) {
        // Estimate sunshine hours based on latitude when data is missing
        const absLat = Math.abs(latitude);
        if (absLat < 23.5) return 2500; // Tropical
        if (absLat < 45) return 2000; // Temperate
        return 1500; // Polar
    }

    getDefaultCoordinates(country) {
        // This would be a fallback for any missing coordinates
        return {
            lat: 0,
            lng: 0,
            region: 'Unknown'
        };
    }

    getAllCountries() {
        return Array.from(this.countries.values());
    }

    getCountry(name) {
        return this.countries.get(name);
    }

    searchCountries(query) {
        query = query.toLowerCase();
        return Array.from(this.countries.values())
            .filter(country => 
                country.name.toLowerCase().includes(query) ||
                country.region.toLowerCase().includes(query)
            );
    }
} 