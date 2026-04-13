import { useCallback, useEffect, useState } from "react";
import FundParticipateBankStep from "./FundParticipateBankStep";
import FundParticipateInfoStep from "./FundParticipateInfoStep";
import FundParticipateNoticeStep from "./FundParticipateNoticeStep";
import './FundParticipatePage.css';

const FundParticipatePage = ({ fundId, optionId, rewardTitle, rewardAmount }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    quantity: 1,
    address: "",
    detailAddress: "",
    phone: "",
    paymentName: "",
    paymentBank: "",
    rewardTitle: rewardTitle || "",
  });
  const [fund, setFund] = useState(null);
  // 모달 안에서 펀딩 단건을 불러올 때: 로딩 / 실패 / 성공을 분리해 무한 "로딩중"과 구분
  const [loadState, setLoadState] = useState("loading"); // loading | error | ready

  const loadFund = useCallback(async () => {
    if (fundId == null || fundId === "" || Number.isNaN(Number(fundId))) {
      setFund(null);
      setLoadState("error");
      return;
    }
    setLoadState("loading");
    setFund(null);
    try {
      const res = await fetch(`/api/fund/view/${fundId}`);
      if (!res.ok) {
        setLoadState("error");
        return;
      }
      const data = await res.json();
      if (!data || typeof data !== "object") {
        setLoadState("error");
        return;
      }
      setFund(data);
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, [fundId]);

  useEffect(() => {
    loadFund();
  }, [loadFund]);

  if (loadState === "loading") {
    return (
      <div className="participate-status participate-status--loading" role="status">
        펀딩 정보를 불러오는 중입니다…
      </div>
    );
  }

  if (loadState === "error" || !fund) {
    return (
      <div className="participate-status participate-status--error" role="alert">
        <p>펀딩 정보를 불러오지 못했습니다.</p>
        <button type="button" className="participate-retry-btn" onClick={loadFund}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="participate-page">
      {step === 1 && (
        <FundParticipateNoticeStep
          onNext={() => setStep(2)}
          deadline={fund.deadline}
        />
      )}
      {step === 2 && (
        <FundParticipateInfoStep
          form={form}
          setForm={setForm}
          onNext={() => setStep(3)}
          onPrev={() => setStep(1)}
          fund={fund}
          optionId={optionId}
          salePrice={rewardAmount}
        />
      )}
      {step === 3 && (
        <FundParticipateBankStep form={form} />
      )}
    </div>
  );
};

export default FundParticipatePage;
