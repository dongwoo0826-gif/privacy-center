/**
 * allPIAData.js — 영향평가 수행안내서(2025.10) 전체 점검항목 통합 배열
 *
 * ※ 이 파일은 반드시 아래 section 파일들이 먼저 로드된 후 불러와야 합니다.
 *    <script src="js/section1-data.js"></script>
 *    <script src="js/section2-data.js"></script>
 *    <script src="js/section3-data.js"></script>
 *    <script src="js/section4aData.js"></script>
 *    <script src="js/section4bData.js"></script>
 *    <script src="js/section5Data.js"></script>
 *    <script src="js/section6aData.js"></script>
 *    <script src="js/section6bData.js"></script>
 *    <script src="js/allPIAData.js"></script>
 *
 * [구성]
 *  section1Data  : 1. 관리체계 및 조직          (section1-data.js)
 *  section2Data  : 2. 개인정보 처리단계별 보호조치 (section2-data.js)
 *  section3Data  : 3. 정보주체 권리보장          (section3-data.js)
 *  section4aData : 4a. 안전성 확보조치 (상)       (section4aData.js)
 *  section4bData : 4b. 안전성 확보조치 (하)       (section4bData.js)
 *  section5Data  : 5. 특수 유형 개인정보          (section5Data.js)
 *  section6aData : 6a. 신기술·서비스 (상)         (section6aData.js)
 *  section6bData : 6b. 신기술·서비스 (하)         (section6bData.js)
 */

const allPIAData = [
  ...section1Data,
  ...section2Data,
  ...section3Data,
  ...section4aData,
  ...section4bData,
  ...section5Data,
  ...section6aData,
  ...section6bData
];
