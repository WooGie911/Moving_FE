import ProgressBar from "@/components/estimateRequest/create/ProgressBar";
import { IEstimateRequestLayoutProps } from "@/types/estimateRequest";

// 공통 스타일 변수
export const ESTIMATE_REQUEST_STYLES = {
  container: "min-h-screen bg-gray-200",
  header: "sticky top-[72px] z-10 bg-white py-6 shadow-sm",
  headerContent: "mx-auto min-w-[330px] md:min-w-175 px-3 md:px-5 lg:max-w-225 lg:px-6",
  title: "text-2lg text-black-400 leading-lg mb-4 font-semibold",
  content: "mx-auto min-w-[330px] space-y-4 py-6 px-3 md:min-w-175 md:px-5 lg:max-w-225 lg:px-6",
  button: "h-[54px] rounded-[16px]",
  buttonFull: "w-full",
  buttonFlex: "flex-1",
  buttonGroup: "flex gap-3",
  addressContainer: "flex min-w-[279px] flex-col gap-2 px-3 py-2",
  questionContainer: "flex min-w-[279px] flex-col gap-3 px-3 py-2",
  questionText: "text-black-400",
  resultContainer: "space-y-2",
  resultItem: "text-base leading-6",
} as const;

export const EstimateRequestLayout: React.FC<IEstimateRequestLayoutProps> = ({ title, progress, children }) => {
  return (
    <main className={ESTIMATE_REQUEST_STYLES.container} role="main" aria-label="견적 요청 페이지">
      {/* 헤더 영역 */}
      <header className={ESTIMATE_REQUEST_STYLES.header} role="banner">
        <div className={ESTIMATE_REQUEST_STYLES.headerContent}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 className={ESTIMATE_REQUEST_STYLES.title} id="estimate-request-title">
              {title}
            </h1>
          </div>
          <ProgressBar value={progress} aria-labelledby="estimate-request-title" aria-label={`진행률 ${progress}%`} />
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <section
        className={ESTIMATE_REQUEST_STYLES.content}
        role="region"
        aria-labelledby="estimate-request-title"
        aria-label="견적 요청 콘텐츠"
      >
        {children}
      </section>
    </main>
  );
};
