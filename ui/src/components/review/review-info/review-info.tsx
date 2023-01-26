import React, { FunctionComponent, ReactNode } from "react";
import "./review-info.scss";

interface Props {
  title: string;
  children: ReactNode;
}

const ReviewInfo: FunctionComponent<Props> = (props) => {
  const { title, children } = props;

  return (
    <div className="review-info">
      <div className="review-info__title">{title}</div>
      <div className="review-info__content">{children}</div>
    </div>
  );
};

export default ReviewInfo;
