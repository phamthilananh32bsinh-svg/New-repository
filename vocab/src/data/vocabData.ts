export interface VocabPair {
  id: string;
  en: string;
  vi: string;
  phonetic?: string;
  note?: string;
}

export interface VocabRound {
  id: number;
  title: string;
  nameVi: string;
  nameEn: string;
  category: 'Structure' | 'Pigments' | 'Processes' | 'Energy & Molecules' | 'Plant Types' | 'Environment & Factors' | 'Biomass & Yield' | 'Academic Terms' | 'Synthesis';
  description: string;
  pairs: VocabPair[];
}

export const VOCAB_ROUNDS: VocabRound[] = [
  {
    id: 1,
    title: 'Vòng 1: Cấu trúc tế bào',
    nameVi: 'Cấu trúc tế bào',
    nameEn: 'Cell Structure',
    category: 'Structure',
    description: 'Các bào quan cơ bản cấu thành tế bào thực vật tham gia vào quá trình sống và quang hợp.',
    pairs: [
      { id: 'p0', en: 'Cell', vi: 'Tế bào', phonetic: '/sɛl/' },
      { id: 'p1', en: 'Chloroplast', vi: 'Lục lạp', phonetic: '/ˈklɔːr.ə.plæst/' },
      { id: 'p2', en: 'Mitochondria', vi: 'Ti thể', phonetic: '/ˌmaɪ.təʊˈkɒn.dri.ə/' },
      { id: 'p3', en: 'Endoplasmic reticulum', vi: 'Lưới nội chất', phonetic: '/ˌɛn.dəʊ.plæz.mɪk rɪˈtɪk.jʊ.ləm/' },
      { id: 'p4', en: 'Cytoplasm', vi: 'Tế bào chất', phonetic: '/ˈsaɪ.təʊ.plæz.əm/' },
      { id: 'p5', en: 'Nucleus', vi: 'Nhân tế bào', phonetic: '/ˈnjuː.kli.əs/' },
      { id: 'p6', en: 'Cell membrane', vi: 'Màng tế bào', phonetic: '/sɛl ˈmɛm.breɪn/' },
      { id: 'p7', en: 'Leaf parenchyma cell', vi: 'Tế bào nhu mô lá', phonetic: '/liːf pəˈrɛŋ.kɪ.mə sɛl/' },
    ],
  },
  {
    id: 2,
    title: 'Vòng 2: Cấu trúc lục lạp',
    nameVi: 'Cấu trúc lục lạp',
    nameEn: 'Chloroplast Structure',
    category: 'Structure',
    description: 'Chi tiết cấu trúc vi thể bên trong lục lạp - nơi diễn ra pha sáng và pha tối.',
    pairs: [
      { id: 'p0', en: 'Outer membrane', vi: 'Màng ngoài', phonetic: '/ˈaʊ.tər ˈmɛm.breɪn/' },
      { id: 'p1', en: 'Inner membrane', vi: 'Màng trong', phonetic: '/ˈɪn.ər ˈmɛm.breɪn/' },
      { id: 'p2', en: 'Thylakoid membrane', vi: 'Màng thylakoid', phonetic: '/ˈθaɪ.lə.kɔɪd ˈmɛm.breɪn/' },
      { id: 'p3', en: 'Stroma', vi: 'Chất nền', phonetic: '/ˈstrəʊ.mə/' },
      { id: 'p4', en: 'Grana', vi: 'Hạt grana', phonetic: '/ˈɡrɑː.nə/' },
      { id: 'p5', en: 'Thylakoid disk', vi: 'Phiến thylakoid', phonetic: '/ˈθaɪ.lə.kɔɪd dɪsk/' },
      { id: 'p6', en: 'Thylakoid lumen', vi: 'Không gian thylakoid', phonetic: '/ˈθaɪ.lə.kɔɪd ˈluː.mən/' },
    ],
  },
  {
    id: 3,
    title: 'Vòng 3: Sắc tố quang hợp 1',
    nameVi: 'Sắc tố quang hợp 1',
    nameEn: 'Photosynthetic Pigments 1',
    category: 'Pigments',
    description: 'Hệ sắc tố chlorophyll và carotenoid hấp thu năng lượng ánh sáng mặt trời.',
    pairs: [
      { id: 'p0', en: 'Pigment', vi: 'Sắc tố', phonetic: '/ˈpɪɡ.mənt/' },
      { id: 'p1', en: 'Pigment system', vi: 'Hệ sắc tố', phonetic: '/ˈpɪɡ.mənt ˈsɪs.təm/' },
      { id: 'p2', en: 'Chlorophyll', vi: 'Diệp lục', phonetic: '/ˈklɒr.ə.fɪl/' },
      { id: 'p3', en: 'Chlorophyll a', vi: 'Diệp lục a', phonetic: '/ˈklɒr.ə.fɪl eɪ/' },
      { id: 'p4', en: 'Chlorophyll b', vi: 'Diệp lục b', phonetic: '/ˈklɒr.ə.fɪl biː/' },
      { id: 'p5', en: 'Carotenoid', vi: 'Carotenoid', phonetic: '/kəˈrɒt.ɪ.nɔɪd/' },
    ],
  },
  {
    id: 4,
    title: 'Vòng 4: Sắc tố quang hợp 2',
    nameVi: 'Sắc tố quang hợp 2',
    nameEn: 'Photosynthetic Pigments 2',
    category: 'Pigments',
    description: 'Các sắc tố phụ và trung tâm phản ứng truyền dẫn electron quang hợp.',
    pairs: [
      { id: 'p0', en: 'Carotene', vi: 'Carotene', phonetic: '/ˈkær.ə.tiːn/' },
      { id: 'p1', en: 'Xanthophyll', vi: 'Xanthophyll', phonetic: '/ˈzæn.θə.fɪl/' },
      { id: 'p2', en: 'Primary pigment', vi: 'Sắc tố chính', phonetic: '/ˈpraɪ.mə.ri ˈpɪɡ.mənt/' },
      { id: 'p3', en: 'Accessory pigment', vi: 'Sắc tố phụ', phonetic: '/əkˈsɛs.ər.i ˈpɪɡ.mənt/' },
      { id: 'p4', en: 'Reaction center', vi: 'Trung tâm phản ứng', phonetic: '/riˈæk.ʃən ˈsɛn.tər/' },
    ],
  },
  {
    id: 5,
    title: 'Vòng 5: Quá trình quang hợp 1',
    nameVi: 'Quá trình quang hợp 1',
    nameEn: 'Photosynthesis Process 1',
    category: 'Processes',
    description: 'Pha sáng, quang phân ly nước và chu trình cố định carbon Calvin.',
    pairs: [
      { id: 'p0', en: 'Photosynthesis', vi: 'Quang hợp', phonetic: '/ˌfəʊ.təʊˈsɪn.θə.sɪs/' },
      { id: 'p1', en: 'Light phase', vi: 'Pha sáng', phonetic: '/laɪt feɪz/' },
      { id: 'p2', en: 'Dark phase', vi: 'Pha tối', phonetic: '/dɑːk feɪz/' },
      { id: 'p3', en: 'Photolysis of water', vi: 'Quang phân ly nước', phonetic: '/fəʊˈtɒl.ɪ.sɪs ɒv ˈwɔː.tər/' },
      { id: 'p4', en: 'Calvin cycle', vi: 'Chu trình Calvin', phonetic: '/ˈkæl.vɪn ˈsaɪ.kəl/' },
    ],
  },
  {
    id: 6,
    title: 'Vòng 6: Quá trình quang hợp 2',
    nameVi: 'Quá trình quang hợp 2',
    nameEn: 'Photosynthesis Process 2',
    category: 'Processes',
    description: 'Các giai đoạn cố định, khử và đồng hóa CO2 thành hợp chất hữu cơ.',
    pairs: [
      { id: 'p0', en: 'CO2 fixation', vi: 'Cố định CO2', phonetic: '/ˌsiː.əʊˈtuː fɪkˈseɪ.ʃən/' },
      { id: 'p1', en: 'CO2 reduction', vi: 'Khử CO2', phonetic: '/ˌsiː.əʊˈtuː rɪˈdʌk.ʃən/' },
      { id: 'p2', en: 'CO2 assimilation', vi: 'Đồng hóa CO2', phonetic: '/ˌsiː.əʊˈtuː əˌsɪm.ɪˈleɪ.ʃən/' },
      { id: 'p3', en: 'Acceptor regeneration', vi: 'Tái sinh chất nhận', phonetic: '/əkˈsɛp.tər rɪˌdʒɛn.əˈreɪ.ʃən/' },
      { id: 'p4', en: 'Acceptor', vi: 'Chất nhận', phonetic: '/əkˈsɛp.tər/' },
    ],
  },
  {
    id: 7,
    title: 'Vòng 7: Năng lượng 1',
    nameVi: 'Năng lượng 1',
    nameEn: 'Energy Forms 1',
    category: 'Energy & Molecules',
    description: 'Dòng chuyển hóa năng lượng từ quang năng thành hóa năng trong phân tử ATP/ADP.',
    pairs: [
      { id: 'p0', en: 'Energy', vi: 'Năng lượng', phonetic: '/ˈɛn.ə.dʒi/' },
      { id: 'p1', en: 'Light energy', vi: 'Quang năng', phonetic: '/laɪt ˈɛn.ə.dʒi/' },
      { id: 'p2', en: 'Chemical energy', vi: 'Hóa năng', phonetic: '/ˈkɛm.ɪ.kəl ˈɛn.ə.dʒi/' },
      { id: 'p3', en: 'Thermal energy', vi: 'Nhiệt năng', phonetic: '/ˈθɜː.məl ˈɛn.ə.dʒi/' },
      { id: 'p4', en: 'ATP', vi: 'ATP', phonetic: '/ˌeɪ.tiːˈpiː/' },
      { id: 'p5', en: 'ADP', vi: 'ADP', phonetic: '/ˌeɪ.diːˈpiː/' },
    ],
  },
  {
    id: 8,
    title: 'Vòng 8: Năng lượng 2',
    nameVi: 'Năng lượng 2',
    nameEn: 'Energy Forms 2',
    category: 'Energy & Molecules',
    description: 'Chất mang lực khử NADPH/NADP+, electron và proton gradient.',
    pairs: [
      { id: 'p0', en: 'NADPH', vi: 'NADPH', phonetic: '/ˌɛn.eɪ.diː.piːˈeɪtʃ/' },
      { id: 'p1', en: 'NADP+', vi: 'NADP+', phonetic: '/ˌɛn.eɪ.diː.piː plʌs/' },
      { id: 'p2', en: 'Chemical bond', vi: 'Liên kết hóa học', phonetic: '/ˈkɛm.ɪ.kəl bɒnd/' },
      { id: 'p3', en: 'Electron', vi: 'Electron', phonetic: '/ɪˈlɛk.trɒn/' },
      { id: 'p4', en: 'Proton', vi: 'Proton', phonetic: '/ˈprəʊ.tɒn/' },
    ],
  },
  {
    id: 9,
    title: 'Vòng 9: Chất hữu cơ',
    nameVi: 'Chất hữu cơ',
    nameEn: 'Organic Compounds',
    category: 'Energy & Molecules',
    description: 'Sản phẩm carbohydrate, đường glucose và các đại phân tử sinh học.',
    pairs: [
      { id: 'p0', en: 'Organic compound', vi: 'Chất hữu cơ', phonetic: '/ɔːˈɡæn.ɪk ˈkɒm.paʊnd/' },
      { id: 'p1', en: 'Carbohydrate', vi: 'Carbohydrate', phonetic: '/ˌkɑː.bəʊˈhaɪ.dreɪt/' },
      { id: 'p2', en: 'Glucose', vi: 'Glucose', phonetic: '/ˈɡluː.kəʊs/' },
      { id: 'p3', en: 'Protein', vi: 'Protein', phonetic: '/ˈprəʊ.tiːn/' },
      { id: 'p4', en: 'Lipid', vi: 'Lipid', phonetic: '/ˈlɪp.ɪd/' },
      { id: 'p5', en: 'Nucleic acid', vi: 'Nucleic acid', phonetic: '/njuːˈkleɪ.ɪk ˈæs.ɪd/' },
      { id: 'p6', en: 'Amino acid', vi: 'Amino acid', phonetic: '/əˈmiː.nəʊ ˈæs.ɪd/' },
    ],
  },
  {
    id: 10,
    title: 'Vòng 10: Nhóm thực vật',
    nameVi: 'Nhóm thực vật',
    nameEn: 'Plant Adaptation Groups',
    category: 'Plant Types',
    description: 'Phân loại các con đường quang hợp C3, C4, CAM và nhóm sinh thái thích nghi.',
    pairs: [
      { id: 'p0', en: 'C3 plants', vi: 'Thực vật C3', phonetic: '/ˌsiːˈθriː plɑːnts/' },
      { id: 'p1', en: 'C4 plants', vi: 'Thực vật C4', phonetic: '/ˌsiːˈfɔː plɑːnts/' },
      { id: 'p2', en: 'CAM plants', vi: 'Thực vật CAM', phonetic: '/kæm plɑːnts/' },
      { id: 'p3', en: 'Sun-loving plant', vi: 'Cây ưa sáng', phonetic: '/sʌn ˈlʌv.ɪŋ plɑːnt/' },
      { id: 'p4', en: 'Shade-loving plant', vi: 'Cây ưa bóng', phonetic: '/ʃeɪd ˈlʌv.ɪŋ plɑːnt/' },
      { id: 'p5', en: 'Succulent plant', vi: 'Cây mọng nước', phonetic: '/ˈsʌk.jʊ.lənt plɑːnt/' },
    ],
  },
  {
    id: 11,
    title: 'Vòng 11: Cấu trúc lá 1',
    nameVi: 'Cấu trúc lá 1',
    nameEn: 'Leaf Anatomy 1',
    category: 'Structure',
    description: 'Giải phẫu hình thái bề mặt lá và khí khổng điều tiết trao đổi khí.',
    pairs: [
      { id: 'p0', en: 'Leaf', vi: 'Lá', phonetic: '/liːf/' },
      { id: 'p1', en: 'Stoma', vi: 'Khí khổng', phonetic: '/ˈstəʊ.mə/' },
      { id: 'p2', en: 'Leaf vein', vi: 'Gân lá', phonetic: '/liːf veɪn/' },
      { id: 'p3', en: 'Leaf surface', vi: 'Bề mặt lá', phonetic: '/liːf ˈsɜː.fɪs/' },
      { id: 'p4', en: 'Leaf area', vi: 'Diện tích lá', phonetic: '/liːf ˈeə.ri.ə/' },
    ],
  },
  {
    id: 12,
    title: 'Vòng 12: Cấu trúc lá 2',
    nameVi: 'Cấu trúc lá 2',
    nameEn: 'Leaf Anatomy 2',
    category: 'Structure',
    description: 'Mô giậu, tế bào bao bó mạch đặc trưng của thực vật C4, biểu bì và mô khuyết.',
    pairs: [
      { id: 'p0', en: 'Mesophyll cell', vi: 'Tế bào mô giậu', phonetic: '/ˈmɛz.əʊ.fɪl sɛl/' },
      { id: 'p1', en: 'Bundle sheath cell', vi: 'Tế bào bao bó mạch', phonetic: '/ˈbʌn.dəl ʃiːθ sɛl/' },
      { id: 'p2', en: 'Epidermal cell', vi: 'Tế bào biểu bì', phonetic: '/ˌɛp.ɪˈdɜː.məl sɛl/' },
      { id: 'p3', en: 'Sclerenchyma', vi: 'Mô khuyết', phonetic: '/skləˈrɛŋ.kɪ.mə/' },
    ],
  },
  {
    id: 13,
    title: 'Vòng 13: Yếu tố môi trường 1',
    nameVi: 'Yếu tố môi trường 1',
    nameEn: 'Environmental Factors 1',
    category: 'Environment & Factors',
    description: 'Ánh sáng, bước sóng quang phổ, tia đỏ và tia xanh tím tác động lên quang hợp.',
    pairs: [
      { id: 'p0', en: 'Light', vi: 'Ánh sáng', phonetic: '/laɪt/' },
      { id: 'p1', en: 'Light intensity', vi: 'Cường độ ánh sáng', phonetic: '/laɪt ɪnˈtɛn.sɪ.ti/' },
      { id: 'p2', en: 'Wavelength', vi: 'Bước sóng', phonetic: '/ˈweɪv.lɛŋθ/' },
      { id: 'p3', en: 'Red light', vi: 'Tia đỏ', phonetic: '/rɛd laɪt/' },
      { id: 'p4', en: 'Blue-violet light', vi: 'Tia xanh tím', phonetic: '/bluː ˈvaɪə.lət laɪt/' },
      { id: 'p5', en: 'Monochromatic light', vi: 'Ánh sáng đơn sắc', phonetic: '/ˌmɒn.əʊ.krəʊˈmæt.ɪk laɪt/' },
    ],
  },
  {
    id: 14,
    title: 'Vòng 14: Yếu tố môi trường 2',
    nameVi: 'Yếu tố môi trường 2',
    nameEn: 'Environmental Factors 2',
    category: 'Environment & Factors',
    description: 'Nhiệt độ, nồng độ khí CO2, độ ẩm và dinh dưỡng khoáng thiết yếu.',
    pairs: [
      { id: 'p0', en: 'Temperature', vi: 'Nhiệt độ', phonetic: '/ˈtɛm.prə.tʃər/' },
      { id: 'p1', en: 'CO2 concentration', vi: 'Nồng độ CO2', phonetic: '/ˌsiː.əʊˈtuː ˌkɒn.sənˈtreɪ.ʃən/' },
      { id: 'p2', en: 'Humidity', vi: 'Độ ẩm', phonetic: '/hjuːˈmɪd.ə.ti/' },
      { id: 'p3', en: 'Mineral element', vi: 'Nguyên tố khoáng', phonetic: '/ˈmɪn.ər.əl ˈɛl.ɪ.mənt/' },
    ],
  },
  {
    id: 15,
    title: 'Vòng 15: Khái niệm & Chỉ số',
    nameVi: 'Khái niệm & Chỉ số',
    nameEn: 'Key Concepts & Indices',
    category: 'Environment & Factors',
    description: 'Điểm bù, điểm bão hòa ánh sáng, CO2 và mối tương quan giữa quang hợp và hô hấp.',
    pairs: [
      { id: 'p0', en: 'Light compensation point', vi: 'Điểm bù ánh sáng', phonetic: '/laɪt ˌkɒm.pɛnˈseɪ.ʃən pɔɪnt/' },
      { id: 'p1', en: 'Light saturation point', vi: 'Điểm bão hòa ánh sáng', phonetic: '/laɪt ˌsætʃ.əˈreɪ.ʃən pɔɪnt/' },
      { id: 'p2', en: 'CO2 compensation point', vi: 'Điểm bù CO2', phonetic: '/ˌsiː.əʊˈtuː ˌkɒm.pɛnˈseɪ.ʃən pɔɪnt/' },
      { id: 'p3', en: 'CO2 saturation point', vi: 'Điểm bão hòa CO2', phonetic: '/ˌsiː.əʊˈtuː ˌsætʃ.əˈreɪ.ʃən pɔɪnt/' },
      { id: 'p4', en: 'Photosynthesis intensity', vi: 'Cường độ quang hợp', phonetic: '/ˌfəʊ.təʊˈsɪn.θə.sɪs ɪnˈtɛn.sɪ.ti/' },
      { id: 'p5', en: 'Respiration intensity', vi: 'Cường độ hô hấp', phonetic: '/ˌrɛs.pɪˈreɪ.ʃən ɪnˈtɛn.sɪ.ti/' },
      { id: 'p6', en: 'Respiration', vi: 'Hô hấp', phonetic: '/ˌrɛs.pɪˈreɪ.ʃən/' },
    ],
  },
  {
    id: 16,
    title: 'Vòng 16: Năng suất',
    nameVi: 'Năng suất',
    nameEn: 'Crop Yield & Biomass',
    category: 'Biomass & Yield',
    description: 'Năng suất sinh học, năng suất kinh tế, hệ số kinh tế và tích lũy chất khô.',
    pairs: [
      { id: 'p0', en: 'Yield', vi: 'Năng suất', phonetic: '/jiːld/' },
      { id: 'p1', en: 'Biological yield', vi: 'Năng suất sinh học', phonetic: '/ˌbaɪ.əˈlɒdʒ.ɪ.kəl jiːld/' },
      { id: 'p2', en: 'Economic yield', vi: 'Năng suất kinh tế', phonetic: '/ˌiː.kəˈnɒm.ɪk jiːld/' },
      { id: 'p3', en: 'Economic coefficient', vi: 'Hệ số kinh tế', phonetic: '/ˌiː.kəˈnɒm.ɪk ˌkəʊ.ɪˈfɪʃ.ənt/' },
      { id: 'p4', en: 'Dry matter mass', vi: 'Khối lượng chất khô', phonetic: '/draɪ ˈmæt.ər mæs/' },
      { id: 'p5', en: 'Economic organ', vi: 'Cơ quan kinh tế', phonetic: '/ˌiː.kəˈnɒm.ɪk ˈɔː.ɡən/' },
    ],
  },
  {
    id: 17,
    title: 'Vòng 17: Động từ chuyên ngành 1',
    nameVi: 'Động từ chuyên ngành 1',
    nameEn: 'Biological Verbs 1',
    category: 'Academic Terms',
    description: 'Các động từ cốt lõi mô tả phản ứng hóa sinh: tổng hợp, hấp thụ, chuyển hóa, oxy hóa.',
    pairs: [
      { id: 'p0', en: 'Synthesize', vi: 'Tổng hợp', phonetic: '/ˈsɪn.θə.saɪz/' },
      { id: 'p1', en: 'Absorb', vi: 'Hấp thụ', phonetic: '/əbˈzɔːb/' },
      { id: 'p2', en: 'Release', vi: 'Giải phóng', phonetic: '/rɪˈliːs/' },
      { id: 'p3', en: 'Convert', vi: 'Chuyển hóa', phonetic: '/kənˈvɜːt/' },
      { id: 'p4', en: 'Fix', vi: 'Cố định', phonetic: '/fɪks/' },
      { id: 'p5', en: 'Reduce', vi: 'Khử', phonetic: '/rɪˈdjuːs/' },
      { id: 'p6', en: 'Oxidize', vi: 'Oxy hóa', phonetic: '/ˈɒk.sɪ.daɪz/' },
    ],
  },
  {
    id: 18,
    title: 'Vòng 18: Động từ chuyên ngành 2',
    nameVi: 'Động từ chuyên ngành 2',
    nameEn: 'Biological Verbs 2',
    category: 'Academic Terms',
    description: 'Vận chuyển, khuếch tán, tích lũy, điều hòa và kích thích các pha quang hóa.',
    pairs: [
      { id: 'p0', en: 'Diffuse', vi: 'Khuếch tán', phonetic: '/dɪˈfjuːz/' },
      { id: 'p1', en: 'Transport', vi: 'Vận chuyển', phonetic: '/ˈtræn.spɔːt/' },
      { id: 'p2', en: 'Accumulate', vi: 'Tích lũy', phonetic: '/əˈkjuː.mjʊ.leɪt/' },
      { id: 'p3', en: 'Regulate', vi: 'Điều hòa', phonetic: '/ˈrɛɡ.jʊ.leɪt/' },
      { id: 'p4', en: 'Promote', vi: 'Xúc tiến', phonetic: '/prəˈməʊt/' },
      { id: 'p5', en: 'Stimulate', vi: 'Kích thích', phonetic: '/ˈstɪm.jʊ.leɪt/' },
      { id: 'p6', en: 'Regenerate', vi: 'Tái sinh', phonetic: '/rɪˈdʒɛn.ə.reɪt/' },
      { id: 'p7', en: 'Decompose', vi: 'Phân giải', phonetic: '/ˌdiː.kəmˈpəʊz/' },
    ],
  },
  {
    id: 19,
    title: 'Vòng 19: Tính từ chuyên ngành',
    nameVi: 'Tính từ chuyên ngành',
    nameEn: 'Biological Adjectives',
    category: 'Academic Terms',
    description: 'Hữu cơ, vô cơ, kích thích, cơ bản, phụ thuộc và các trạng thái quang năng.',
    pairs: [
      { id: 'p0', en: 'Organic', vi: 'Hữu cơ', phonetic: '/ɔːˈɡæn.ɪk/' },
      { id: 'p1', en: 'Inorganic', vi: 'Vô cơ', phonetic: '/ˌɪn.ɔːˈɡæn.ɪk/' },
      { id: 'p2', en: 'Direct', vi: 'Trực tiếp', phonetic: '/daɪˈrɛkt/' },
      { id: 'p3', en: 'Indirect', vi: 'Gián tiếp', phonetic: '/ˌɪn.daɪˈrɛkt/' },
      { id: 'p4', en: 'Dependent', vi: 'Phụ thuộc', phonetic: '/dɪˈpɛn.dənt/' },
      { id: 'p5', en: 'Independent', vi: 'Độc lập', phonetic: '/ˌɪn.dɪˈpɛn.dənt/' },
      { id: 'p6', en: 'Excited', vi: 'Kích thích', phonetic: '/ɪkˈsaɪ.tɪd/' },
      { id: 'p7', en: 'Ground', vi: 'Bình thường', phonetic: '/ɡraʊnd/' },
      { id: 'p8', en: 'Favorable', vi: 'Thuận lợi', phonetic: '/ˈfeɪ.vər.ə.bəl/' },
      { id: 'p9', en: 'Unfavorable', vi: 'Bất lợi', phonetic: '/ʌnˈfeɪ.vər.ə.bəl/' },
    ],
  },
  {
    id: 20,
    title: 'Vòng 20: Cụm từ quan trọng 1',
    nameVi: 'Cụm từ quan trọng 1',
    nameEn: 'Key Phrases 1',
    category: 'Academic Terms',
    description: 'Chuỗi truyền electron, gradient proton, liên kết hóa học và hiệu ứng nhà kính.',
    pairs: [
      { id: 'p0', en: 'Synthesize organic compounds', vi: 'Tổng hợp chất hữu cơ', phonetic: '/ˈsɪn.θə.saɪz ɔːˈɡæn.ɪk ˈkɒm.paʊndz/' },
      { id: 'p1', en: 'Raw materials', vi: 'Nguyên liệu đầu vào', phonetic: '/rɔː məˈtɪə.ri.əlz/' },
      { id: 'p2', en: 'Final products', vi: 'Sản phẩm cuối cùng', phonetic: '/ˈfaɪ.nəl ˈprɒd.ʌkts/' },
      { id: 'p3', en: 'Chemical bonds', vi: 'Liên kết hóa học', phonetic: '/ˈkɛm.ɪ.kəl bɒndz/' },
      { id: 'p4', en: 'Electron transport chain', vi: 'Chuỗi truyền electron', phonetic: '/ɪˈlɛk.trɒn ˈtræn.spɔːt tʃeɪn/' },
      { id: 'p5', en: 'Proton gradient', vi: 'Gradient proton', phonetic: '/ˈprəʊ.tɒn ˈɡreɪ.di.ənt/' },
      { id: 'p6', en: 'Greenhouse effect', vi: 'Hiệu ứng nhà kính', phonetic: '/ˈɡriːn.haʊs ɪˈfɛkt/' },
    ],
  },
  {
    id: 21,
    title: 'Vòng 21: Cụm từ quan trọng 2',
    nameVi: 'Cụm từ quan trọng 2',
    nameEn: 'Key Phrases 2',
    category: 'Academic Terms',
    description: 'Sinh vật tự dưỡng, dị dưỡng, nông học thực tiễn và thích nghi sinh thái.',
    pairs: [
      { id: 'p0', en: 'Heterotrophic organisms', vi: 'Sinh vật dị dưỡng', phonetic: '/ˌhɛt.ər.əʊˈtrɒf.ɪk ˈɔː.ɡən.ɪ.zəmz/' },
      { id: 'p1', en: 'Autotrophic organisms', vi: 'Sinh vật tự dưỡng', phonetic: '/ˌɔː.təʊˈtrɒf.ɪk ˈɔː.ɡən.ɪ.zəmz/' },
      { id: 'p2', en: 'Metabolic process', vi: 'Quá trình trao đổi chất', phonetic: '/ˌmɛt.əˈbɒl.ɪk ˈprəʊ.sɛs/' },
      { id: 'p3', en: 'Physiological adaptation', vi: 'Thích nghi sinh lý', phonetic: '/ˌfɪz.i.əˈlɒdʒ.ɪ.kəl ˌæd.æpˈteɪ.ʃən/' },
      { id: 'p4', en: 'Planting density', vi: 'Mật độ trồng', phonetic: '/ˈplɑːn.tɪŋ ˈdɛn.sɪ.ti/' },
      { id: 'p5', en: 'Rational fertilization', vi: 'Bón phân hợp lý', phonetic: '/ˈræʃ.ən.əl ˌfɜː.tɪ.laɪˈzeɪ.ʃən/' },
      { id: 'p6', en: 'Proper irrigation', vi: 'Tưới tiêu hợp lý', phonetic: '/ˈprɒp.ər ˌɪr.ɪˈɡeɪ.ʃən/' },
      { id: 'p7', en: 'Appropriate care', vi: 'Chăm sóc phù hợp', phonetic: '/əˈprəʊ.pri.ət keər/' },
      { id: 'p8', en: 'Arid environment', vi: 'Môi trường khô hạn', phonetic: '/ˈær.ɪd ɪnˈvaɪ.rən.mənt/' },
      { id: 'p9', en: 'Desert region', vi: 'Vùng sa mạc', phonetic: '/ˈdɛz.ət ˈriː.dʒən/' },
      { id: 'p10', en: 'Tropical region', vi: 'Vùng nhiệt đới', phonetic: '/ˈtrɒp.ɪ.kəl ˈriː.dʒən/' },
      { id: 'p11', en: 'Temperate zone', vi: 'Vùng ôn đới', phonetic: '/ˈtɛm.pər.ət zəʊn/' },
    ],
  },
  {
    id: 22,
    title: 'Vòng 22: Thử thách tổng hợp',
    nameVi: 'Thử thách tổng hợp',
    nameEn: 'Synthesis Challenge',
    category: 'Synthesis',
    description: 'Vòng đấu tổng hợp: 8 cặp từ vựng ngẫu nhiên được chọn từ toàn bộ các vòng trước, không trùng lặp. Mỗi lượt chơi là một thử thách mới!',
    pairs: [
      { id: 'p0', en: 'Photosynthesis', vi: 'Quang hợp', phonetic: '/ˌfəʊ.təʊˈsɪn.θə.sɪs/' },
      { id: 'p1', en: 'Chloroplast', vi: 'Lục lạp', phonetic: '/ˈklɔːr.ə.plæst/' },
      { id: 'p2', en: 'Calvin cycle', vi: 'Chu trình Calvin', phonetic: '/ˈkæl.vɪn ˈsaɪ.kəl/' },
      { id: 'p3', en: 'Light energy', vi: 'Quang năng', phonetic: '/laɪt ˈɛn.ə.dʒi/' },
      { id: 'p4', en: 'Thylakoid membrane', vi: 'Màng thylakoid', phonetic: '/ˈθaɪ.lə.kɔɪd ˈmɛm.breɪn/' },
      { id: 'p5', en: 'Chlorophyll', vi: 'Diệp lục', phonetic: '/ˈklɒr.ə.fɪl/' },
      { id: 'p6', en: 'CO2 fixation', vi: 'Cố định CO2', phonetic: '/ˌsiː.əʊˈtuː fɪkˈseɪ.ʃən/' },
      { id: 'p7', en: 'Biological yield', vi: 'Năng suất sinh học', phonetic: '/ˌbaɪ.əˈlɒdʒ.ɪ.kəl jiːld/' },
    ],
  },
];

/**
 * Returns all unique vocabulary pairs across standard Rounds 1-21.
 * Guaranteed no duplicate English terms.
 */
export function getAllBaseVocabPairs(): VocabPair[] {
  const seenEn = new Set<string>();
  const allPairs: VocabPair[] = [];

  for (const round of VOCAB_ROUNDS) {
    if (round.id === 22) continue; // Only take from original rounds 1-21
    for (const pair of round.pairs) {
      const key = pair.en.trim().toLowerCase();
      if (!seenEn.has(key)) {
        seenEn.add(key);
        allPairs.push(pair);
      }
    }
  }

  return allPairs;
}

/**
 * Generates N random pairs from the provided 21 rounds pool.
 * Guaranteed:
 * 1. Randomly sampled
 * 2. Exactly `count` items (default 8)
 * 3. NO duplicate terms in the same round
 * 4. Strictly within provided content of rounds 1-21
 */
export function generateSynthesisPairs(count: number = 8): VocabPair[] {
  const pool = getAllBaseVocabPairs();
  const shuffled = [...pool];

  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count).map((item, idx) => ({
    id: `p${idx}`,
    en: item.en,
    vi: item.vi,
    phonetic: item.phonetic,
    note: item.note,
  }));
}

/**
 * Helper to prepare round data for gameplay.
 * If Round 22 is selected, generates a fresh random non-duplicate 8-pair set.
 */
export function getRoundForPlay(round: VocabRound): VocabRound {
  if (round.id === 22) {
    return {
      ...round,
      pairs: generateSynthesisPairs(8),
    };
  }
  return round;
}
