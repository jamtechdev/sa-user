import ChartPanaScreen from './ChartPanaScreen';

type Props = {
  marketId: string;
  marketName: string;
  gameId: string;
  gameName: string;
};

export default function SinglePanaScreen(props: Props) {
  return <ChartPanaScreen {...props} kind="single" gameName="Single Pana" />;
}
