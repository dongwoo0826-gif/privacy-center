/* ──────────────────────────────────────────────────────
 *  allAiComments.js
 *  6개 영역 AI 보완 코멘트를 하나의 객체로 통합
 *  의존성: aiComments.js (반드시 먼저 로드)
 * ────────────────────────────────────────────────────── */
const allAiComments = {
  ...section1_2_aiComments,
  ...section3_aiComments,
  ...section4a_aiComments,
  ...section4b_aiComments,
  ...section5a_aiComments,
  ...section5b_aiComments
};
