import React, { useTransition, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import asides from "../../routes/asideRoutes";

const LoadingScreen: React.FC = () => <h2>🔄 Đang tải...</h2>;

const AsideRoutes: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    startTransition(() => {
      setTimeout(() => setIsLoaded(true), 100); // Chờ React hoàn tất render
    });
  }, []);

  return isLoaded && !isPending ? (
    <Routes>
      {asides.map((page) => (
        <Route key={page.path} {...page} />
      ))}
    </Routes>
  ) : (
    <LoadingScreen />
  );
};

export default AsideRoutes;
