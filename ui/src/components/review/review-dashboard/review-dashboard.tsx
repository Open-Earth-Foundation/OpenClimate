import { FunctionComponent, useEffect, useState } from "react";
import "./review-dashboard.scss";
import Masonry from "react-masonry-css";
import PledgesWidget from "../pledges-widget/pledges-widget";
import EmissionsWidget from "../emissions-widget/emissions-widget";
import ContextualDataWidget from "../../../shared/components/widgets/contextual-data/contextual-data.widget";

interface Props {
  current: any;
  parent: any;
  toggleScroll: () => void;
}

const Dashboard: FunctionComponent<Props> = (props) => {
  const { current, parent, toggleScroll } = props;

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="review__dashboard">
      <div className="review__dashboard-widgets">
        <div className="review__dashboard-layout">
          <EmissionsWidget
            key={`emissions-${current.actor_id}`}
            current={current}
            isMobile={width < 900}
            parent={parent}
            hasFilter={true}
            hasDownload={true}
            toggleScroll={toggleScroll}
          />
          {current.type !== "site" && (
            <ContextualDataWidget
              key={`contextual-${current.actor_id}`}
              current={current}
              parent={parent}
            />
          )}
        </div>
        <div>
          <PledgesWidget
            key={`pledges-${current.actor_id}`}
            isMobile={width < 900}
            currentWidth={width}
            current={current}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
