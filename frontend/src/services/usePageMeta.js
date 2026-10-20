import { useEffect } from "react";

export function usePageMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = `${title} | PUST Alumni Network`;
    }
    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", description);
      }
    }
    return () => {
      document.title = prevTitle;
    };
  }, [title, description]);
}

export default usePageMeta;
