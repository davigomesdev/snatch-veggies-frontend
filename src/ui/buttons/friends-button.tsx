import Sprite from '../common/sprite';

const FriendsButton: React.FC = () => {
  return (
    <button className="cursor-not-allowed space-y-2">
      <div className="relative flex items-center justify-center">
        <Sprite src="/ui/bg-hud-action-small.png" width={310} />
        <Sprite src="/ui/envelope.png" width={240} className="absolute z-10" />
      </div>
    </button>
  );
};

export default FriendsButton;
