import ChartPanaScreen from './ChartPanaScreen';

type Props = {
  marketId: string;
  marketName: string;
  gameId: string;
  gameName: string;
};

export default function TriplePanaScreen(props: Props) {
  return <ChartPanaScreen {...props} kind="triple" gameName="Triple Pana" />;
}
