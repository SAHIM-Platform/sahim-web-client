import { RefreshCw } from "lucide-react";

import Button from "../Button";

interface RetryAgainProps { 
  error: string;
  handleRetry: () => void;
}

function RetryAgain({ error, handleRetry }: RetryAgainProps) {
  return (
    <div className="space-y-4 flex flex-col items-center justify-center h-full">
      <p className="text-gray-500">{error}</p>
      <Button
        onClick={handleRetry}
        variant="outline"
        icon={<RefreshCw className="w-4" />}
        color="secondary"
      >
        إعادة المحاولة
      </Button>
    </div>
  );
}

export default RetryAgain;