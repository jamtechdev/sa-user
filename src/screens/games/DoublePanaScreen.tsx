import ChartPanaScreen from './ChartPanaScreen';

type Props = {
  marketId: string;
  marketName: string;
  gameId: string;
  gameName: string;
};

export default function DoublePanaScreen(props: Props) {
  return <ChartPanaScreen {...props} kind="double" gameName="Double Pana" />;
}
