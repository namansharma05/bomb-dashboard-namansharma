import React, { useEffect, useMemo, useState } from 'react';
import {useParams} from 'react-router-dom';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useBombStats from '../../hooks/useBombStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsBTC from '../../hooks/useLpStatsBTC';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usebShareStats from '../../hooks/usebShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
// import { Bomb as bombTesting } from '../../bomb-finance/deployments/deployments.testing.json';
//import { Bomb as bombProd } from '../../bomb-finance/deployments/deployments.mainnet.json';
import { roundAndFormatNumber } from '../../0x';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import { Box, Button, Card, CardContent, Grid, Paper, Typography } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';
import { Alert } from '@material-ui/lab';
import { IoCloseOutline } from 'react-icons/io5';
import { BiLoaderAlt } from 'react-icons/bi';
import { makeStyles } from '@material-ui/core/styles';
import useBombFinance from '../../hooks/useBombFinance';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useStatsForPool from '../../hooks/useStatsForPool';
import moment from 'moment';
import useBank from '../../hooks/useBank';
//import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';
import { Helmet } from 'react-helmet';
import BombImage from '../../assets/img/bomb.png';
import BSharesImage from '../../assets/img/bshares.png';
import BBondImage from '../../assets/img/bbond.png';
import RightArrow from '../../assets/img/Vector.png';
import DiscordImage from '../../assets/img/pw4945914 1.png';
import DocsImage from '../../assets/img/ww2991106 1.png';
import BombBitcoinImage from '../../assets/img/bomb-bitcoin-LP.png';
import BShareBnbImage from '../../assets/img/bshare-bnb-LP.png';

//import useBombMaxiStats from '../../hooks/useBombMaxiStats';

import HomeImage from '../../assets/img/background.jpg';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'bomb.money | BTC pegged algocoin';

// const BackgroundImage = createGlobalStyle`
//   body {
//     background-color: grey;
//     background-size: cover !important;
//   }
// `;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      // marginTop: '10px'
    },
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const bombFtmLpStats = useLpStatsBTC('BOMB-BTCB-LP');
  const bShareFtmLpStats = useLpStats('BSHARE-BNB-LP');
  const currentEpoch = useCurrentEpoch();
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const cashStat = useCashPriceInEstimatedTWAP();
  const tBondStats = useBondStats();
  const bombFinance = useBombFinance();
  const { to } = useTreasuryAllocationTimes()
  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const {bankId} = useParams();
  const bank = useBank(bankId);
  let statsOnPool = useStatsForPool(bank);
  // const bombmaxi = useBombMaxiStats('0xd6f52e8ab206e59a1e13b3d6c5b7f31e90ef46ef000200000000000000000028');

  // console.log(bombmaxi);
  // let bomb;
  // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  //   bomb = bombTesting;
  // } else {
  //   bomb = bombProd;
  // }

  const buyBombAddress = //'https://app.1inch.io/#/56/swap/BTCB/BOMB';
    //  'https://pancakeswap.finance/swap?inputCurrency=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&outputCurrency=' +
    'https://app.bogged.finance/bsc/swap?tokenIn=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&tokenOut=0x522348779DCb2911539e76A1042aA922F9C47Ee3';
  //https://pancakeswap.finance/swap?outputCurrency=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBShareAddress = //'https://app.1inch.io/#/56/swap/BNB/BSHARE';
    'https://app.bogged.finance/bsc/swap?tokenIn=BNB&tokenOut=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBusmAddress =
    'https://app.bogged.finance/bsc/swap?tokenIn=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&tokenOut=0x6216B17f696B14701E17BCB24Ec14430261Be94A';
  const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
  const bshareLPStats = useMemo(() => (bShareFtmLpStats ? bShareFtmLpStats : null), [bShareFtmLpStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const bombLpZap = useZap({ depositTokenName: 'BOMB-BTCB-LP' });
  const bshareLpZap = useZap({ depositTokenName: 'BSHARE-BNB-LP' });

  const [onPresentBombZap, onDissmissBombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBombZap();
      }}
      tokenName={'BOMB-BTCB-LP'}
    />,
  );

  const [onPresentBshareZap, onDissmissBshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBshareZap();
      }}
      tokenName={'BSHARE-BNB-LP'}
    />,
  );

  const [modal, setModal] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const openModal = () => {
    setModal(!modal);
  };

  const spinner = () => {
    setVideoLoading(!videoLoading);
  };
  // const [onPresentIntroVid] = useModal(
  //   <grid>
  //     <Paper>
  //       <div>
  //         <iframe
  //           width="560"
  //           height="315"
  //           src="https://www.youtube.com/embed/nhCWmmRNNhc"
  //           title="YouTube video player"
  //           frameborder="0"
  //           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  //           allowfullscreen
  //         ></iframe>
  //       </div>
  //     </Paper>
  //   </grid>,
  // );
  
  return (
    // <Page>
    <div>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <BackgroundImage />
      <Grid container xs={12} justifyContent="center" alignItems='center' style={{position: "absolute",left: "12rem",top: "1rem",width: "62rem",height: "21rem",background: "rgba(35, 40, 75, 0.75)",color: "#FFFFFF",backdropFilter: "blur(0px)",borderRadius: "10px"}}>
      <div style={{position: "absolute",width: "242px",height: "30px",left: "24rem",top: "26.41px",fontFamily: 'Nunito',fontStyle: "normal",fontWeight: "400",fontSize: "22px",lineHeight: "30px",color: "#FFFFFF"}}>Bomb Finance Summary</div>
      <div style={{position: "absolute",width: "900px",height: "0px",left: "40px",top: "61px",border: "0.5px solid rgba(195, 197, 203, 0.75)"}}></div>
        <Grid item xs={6}>
            <div>
                <div style={{position: "absolute",width: "68px",height: "14px",left: "129px",top: "100px",fontFamily: 'Nunito',fontStyle: "normal",fontWeight: "400",fontSize: "10px",lineHeight: "14px",color: "#FFFFFF"}}>Current Supply</div>
                <div style={{position: "absolute",width: "68px",height: "14px",left: "209px",top: "100px",fontFamily: 'Nunito',fontStyle: "normal",fontWeight: "400",fontSize: "10px",lineHeight: "14px",color: "#FFFFFF"}}>Total Supply</div>
                <div style={{position: "absolute",width: "68px",height: "14px",left: "300px",top: "100px",fontFamily: 'Nunito',fontStyle: "normal",fontWeight: "400",fontSize: "10px",lineHeight: "14px",color: "#FFFFFF"}}>Price</div>
            </div>
            <div style={{position: "absolute",width: "299px",height: "0px",left: "100px",top: "120px",border: "0.5px solid rgba(195, 197, 203, 0.75)"}}></div>
            <div>
                <div style={{position: "absolute",width: "25px", height: "25px",left: "33px",top: "135px", background: "#373747",borderRadius: "200px"}}>
                    <img src={BombImage} alt="Bomb.money" style={{ maxHeight: '20px', position: "absolute", left: "3px", top: "1px"}} />
                </div>
                <div style={{position: "absolute",width: "43px",height: "16px",left: "64px",top: "137px",fontFamily: 'Nunito',fontStyle: "normal",fontWeight: "400",fontSize: "12px",lineHeight: "16px",color: "#FFFFFF"}}>$BOMB</div>
                <div style={{position: "absolute", width: "41px", height: "19px", left: "138px", top: "135px", fontFamily: "Nunito",fontStyle: "normal", fontSize: "14px",fontWeight: "600",lineHeight: "19px",textAlign: "center",color:"#FFFFFF"}}>{roundAndFormatNumber(bombCirculatingSupply, 2)}</div>
                <div style={{position: "absolute", width: "40px", height: "19px", left: "214px", top: "135px", fontFamily: "Nunito",fontStyle: "normal", fontSize: "14px",fontWeight: "600",lineHeight: "19px",textAlign: "center",color:"#FFFFFF"}}>{roundAndFormatNumber(bombTotalSupply, 2)}</div>
                <div style={{position: "absolute", width: "84px", height: "38px", left: "279px", top: "135px", fontFamily: "Nunito",fontStyle: "normal", fontSize: "14px",fontWeight: "600",lineHeight: "19px",textAlign: "center",color:"#FFFFFF"}}>${bombPriceInDollars}<br/>{bombPriceInBNB} BNB</div>
                <img src={MetamaskFox} alt="Metamask.money" style={{ maxHeight: '31.41px', position: "absolute", left: "361px", top: "135px"}} />
                <div style={{position: "absolute",width: "352px",height: "0px",left: "48px",top: "180px",border: "0.5px solid rgba(195, 197, 203, 0.75)"}}></div>
            </div>
            <div>
                <div style={{position: "absolute",width: "25px", height: "25px",left: "33px",top: "195px", background: "#373747",borderRadius: "200px"}}>
                    <img src={BSharesImage} alt="Bomb.money" style={{ maxHeight: '20px', position: "absolute", left: "3px", top: "1px"}} />
                </div>
                <div style={{position: "absolute",width: "43px",height: "16px",left: "64px",top: "197px",fontFamily: 'Nunito',fontStyle: "normal",fontWeight: "400",fontSize: "12px",lineHeight: "16px",color: "#FFFFFF"}}>$BSHARE</div>
                <div style={{position: "absolute", width: "41px", height: "19px", left: "138px", top: "195px", fontFamily: "Nunito",fontStyle: "normal", fontSize: "14px",fontWeight: "600",lineHeight: "19px",textAlign: "center",color:"#FFFFFF"}}>{roundAndFormatNumber(bShareCirculatingSupply, 2)}</div>
                <div style={{position: "absolute", width: "40px", height: "19px", left: "214px", top: "195px", fontFamily: "Nunito",fontStyle: "normal", fontSize: "14px",fontWeight: "600",lineHeight: "19px",textAlign: "center",color:"#FFFFFF"}}>{roundAndFormatNumber(bShareTotalSupply, 2)}</div>
                <div style={{position: "absolute", width: "84px", height: "38px", left: "279px", top: "195px", fontFamily: "Nunito",fontStyle: "normal", fontSize: "14px",fontWeight: "600",lineHeight: "19px",textAlign: "center",color:"#FFFFFF"}}>${bSharePriceInDollars}<br/>{bSharePriceInBNB} BNB</div>
                <img src={MetamaskFox} alt="Metamask.money" style={{ maxHeight: '31.41px', position: "absolute", left: "361px", top: "195px"}} />
                <div style={{position: "absolute",width: "352px",height: "0px",left: "48px",top: "240px",border: "0.5px solid rgba(195, 197, 203, 0.75)"}}></div>
            </div>
            <div>
                <div style={{position: "absolute",width: "25px", height: "25px",left: "33px",top: "255px", background: "#373747",borderRadius: "200px"}}>
                    <img src={BBondImage} alt="Bomb.money" style={{ maxHeight: '20px', position: "absolute", left: "3px", top: "1px"}} />
                </div>
                <div style={{position: "absolute",width: "43px",height: "16px",left: "64px",top: "257px",fontFamily: 'Nunito',fontStyle: "normal",fontWeight: "400",fontSize: "12px",lineHeight: "16px",color: "#FFFFFF"}}>$BBOND</div>
                <div style={{position: "absolute", width: "41px", height: "19px", left: "138px", top: "255px", fontFamily: "Nunito",fontStyle: "normal", fontSize: "14px",fontWeight: "600",lineHeight: "19px",textAlign: "center",color:"#FFFFFF"}}>{roundAndFormatNumber(tBondCirculatingSupply, 2)}</div>
                <div style={{position: "absolute", width: "40px", height: "19px", left: "214px", top: "255px", fontFamily: "Nunito",fontStyle: "normal", fontSize: "14px",fontWeight: "600",lineHeight: "19px",textAlign: "center",color:"#FFFFFF"}}>{roundAndFormatNumber(tBondTotalSupply, 2)}</div>
                <div style={{position: "absolute", width: "84px", height: "38px", left: "279px", top: "255px", fontFamily: "Nunito",fontStyle: "normal", fontSize: "14px",fontWeight: "600",lineHeight: "19px",textAlign: "center",color:"#FFFFFF"}}>${tBondPriceInDollars} <br/> {tBondPriceInBNB} BNB</div>
                <img src={MetamaskFox} alt="Metamask.money" style={{ maxHeight: '31.41px', position: "absolute", left: "361px", top: "255px"}} />
                <div style={{position: "absolute",width: "299px",height: "0px",left: "100px",top: "300px",border: "0.5px solid rgba(195, 197, 203, 0.75)"}}></div>
            </div>
        </Grid>
        <Grid item xs={6} justifyContent="end">
            <div style={{position: "absolute",width: "118px",height: "63px",left: "822px",top: "75px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "600",fontSize:"18px",fontHeight: "25px",textAlign: "center",color: "#FFFFFF"}}>Current Epoch <span style={{fontSize: "34px"}}>{Number(currentEpoch)}</span></div>
            <div style={{position: "absolute",width: "185.01px",height: "0px",left: "785px",top: "140px",border: "0.5px solid rgba(195, 197, 203, 0.75)"}}></div>
            <div style={{position: "absolute",width: "140px",height: "63px",left: "810px",top: "135px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "700",fontSize:"34px",fontHeight: "25px",textAlign: "center",color: "#FFFFFF"}}><ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" /> <span style={{fontSize: "18px",position: "absolute",left: "15px",top: "49px"}}>Next Epoch in</span></div>
            <div style={{position: "absolute",width: "128px",height: "0px",left: "810px",top: "216px",border: "0.5px solid rgba(195, 197, 203, 0.75)"}}></div>
            <div style={{position: "absolute",width: "145px",height: "19px",left: "805px",top: "225px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "300",fontSize:"14px",fontHeight: "19px",textAlign: "center",color: "#FFFFFF"}}>Live TWAP: <span style={{color: "#00E8A2"}}>{scalingFactor}</span></div>
            <div style={{position: "absolute",width: "107px",height: "19px",left: "820px",top: "247px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "300",fontSize:"14px",fontHeight: "19px",textAlign: "center",color: "#FFFFFF"}}>TVL: <span style={{color: "#00E8A2"}}><CountUp end={TVL} separator="," prefix="$" /></span></div>
            <div style={{position: "absolute",width: "187px",height: "19px",left: "786px",top: "269px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "300",fontSize:"14px",fontHeight: "19px",textAlign: "center",color: "#FFFFFF"}}>Last Epoch TWAP: <span style={{color: "#00E8A2"}}>{scalingFactor}</span></div>
        </Grid>
      </Grid>
      <Grid container xs={12} style={{position: "absolute",left: "12rem",top: "23rem",width: "62rem",height: "21rem",color: "#FFFFFF",backdropFilter: "blur(0px)"}}>
        <Grid item xs={7}>
            <div style={{position: "absolute",left: "366px",width: "196px",height: "22px",fontFamily: "Nunito",fontSize: "16px",fontStyle: "normal",fontWeight: "600",lineHeight: "22px",display: "flex",alignItems: "center",textDecoration: "underline",fontFeatureSettings: "liga off",color: "#9EE6FF",flex: "none",order: "0",flexGrow: "0"}}>Read Investment Strategy <p><img src={RightArrow} alt="rightArrow.money" style={{ maxHeight: '8.42px'}} /></p></div>
            <button style={{position: "absolute",width: "558px",height: "40px",left: "3px",top: "32px",background: "radial-gradient(59345.13% 4094144349.28% at 39511.5% -2722397851.45%, rgba(0, 245, 171, 0.5) 0%, rgba(0, 173, 232, 0.5) 100%)", border: "0.5px solid #E41A1A",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "800",fontSize: "24px",lineHeight: "33px",color: "#FFFFFF"}}>Invest Now</button>
            <button href="https://discord.com/invite/94Aa4wSz3e" style={{display: "inline-flex",alignItems: "center",position: "absolute",width: "270px",height: "40px",left: "3px",top: "85px",background: "rgba(255, 255, 255, 0.5)", border: "1px solid #728CDF",backdropFilter: "blur(0px)"}}><span style={{position: "absolute",width: "30.91px",height: "30.91px",left: "68.89px",top: "3px",background: "#FFFFFF",borderRadius: "200px"}}><img src={DiscordImage} alt="discord.money" style={{ maxHeight: '27.63px'}} /></span><span style={{position: "absolute", left: "110px"}}>Chat on Discord</span></button>
            <button style={{display: "inline-flex",position: "absolute",alignItems: "center",width: "270px",height: "40px",left: "290px",top: "85px",background: "rgba(255, 255, 255, 0.5)", border: "1px solid #728CDF",backdropFilter: "blur(0px)"}}><span style={{position: "absolute",width: "30.91px",height: "30.91px",left: "68.89px",top: "3px",background: "#FFFFFF",borderRadius: "200px"}}><img src={DocsImage} alt="Docs.money" style={{ maxHeight: '27.63px', margin: "3px 0 0 2px"}} /></span><span style={{position: "absolute",left: "110px"}}>Read Docs</span></button>
            <div style={{position: "absolute",width: "559px",height: "202px",top: "132px", background: "rgba(35, 40, 75, 0.75)", border: "1px solid #728CDF",backdropFilter: "blur(0px)",borderRadius: "10px"}}>
                <img src={BSharesImage} alt="bshare.money" style={{position: "absolute",width: "48px",height: '48px',left: "16px",top: "14px"}} />
                <div style={{position: "absolute",width: "115px",height: "30px",left: "72.29px",top: "12px", fontFamily: "Nunito",fontStyle: "normal", fontWeight: "700",fontSize: "22px",lineHeight: "30px",color: "#FFFFFF"}}>Boardroom</div>
                <div style={{position: "absolute",width: "101px",height: "16px",left: "190px",top: "19px", fontFamily: "Nunito",fontStyle: "normal", fontWeight: "600",fontSize: "12px",lineHeight: "16px",background: "rgba(0, 232, 162, 0.25)",border: "1px solid #00E8A2",filter: "blur(0.5px)",display: "flex",justifyContent: "center",borderRadius: "3px",color: "#FFFFFF"}}>Recommended</div>
                <div style={{position: "absolute",width: "279px",height: "19px",left: "72.29px",top: "44px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "19px",color: "#FFFFFF"}}>Stake BSHARE and earn BOMB every epoch</div>
                <div style={{position: "absolute",width: "118px",height: "22px",left: "430px",top: "40.43px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "19px",color: "#FFFFFF"}}>TVL: $1,008,430</div>
                <div style={{position: "absolute",width: "462px",height: "0px",left: "72px",top: "69px",border: "0.5px solid rgba(195, 197, 203, 0.75)"}}></div>
                <div style={{position: "absolute",width: "89px",height: "52px",left: "32px",top: "119.43px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "19px",color: "#FFFFFF"}}>Daily Returns:<br/><span>2%</span></div>
                <div style={{position: "absolute",width: "74px",height: "60px",left: "156px",top: "119.43px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "19px",color: "#FFFFFF"}}>Your Stake: <br/><span><img src={BSharesImage} alt="bshare.money" style={{width: "18px",height: "18px"}} />6.0000</span><br/><span>≈ $1171.62</span></div>
                <div style={{position: "absolute",width: "100px",height: "60px",left: "256px",top: "119.43px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "19px",color: "#FFFFFF"}}>Earned: <br/><span><img src={BombImage} alt="Bomb.money" style={{width: "18px",height: "18px"}} />6.0000</span><br/><span>≈ $1171.62</span></div>
                <div style={{position: "absolute",width: "152px",height: "22px",left: "387px",top: "75px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "19px",color: "#FFFFFF"}}>Total Staked: <span><img src={BSharesImage} alt="bshare.money" style={{width: "18px",height: "18px"}} />6.0000</span></div>
                <button style={{display: "grid",gridTemplateColumns: "auto auto",position: "absolute",width: "100px",height: "27px",left: "347px",top: "115px",background: "none",border: "1px solid #FFFFFF",borderRadius: "20px",justifyContent: "space-between",alignItems: "center",color: "#FFFFFF"}}>Deposit<span style={{background: "#FFFFFF",width: "17.5px",height: "17.5px",borderRadius: "200px"}}></span></button>
                <button style={{display: "grid",gridTemplateColumns: "auto auto",position: "absolute",width: "100px",height: "27px",left: "452px",top: "115px",background: "none",border: "1px solid #FFFFFF",borderRadius: "20px",justifyContent: "space-between",alignItems: "center",color: "#FFFFFF"}}>Withdraw<span style={{background: "#FFFFFF",width: "17.5px",height: "17.5px",borderRadius: "200px"}}></span></button>
                <button style={{display: "grid",position: "absolute",width: "205px",height: "30px",left: "347px",top: "155px",background: "none",border: "1px solid #FFFFFF",borderRadius: "20px",justifyContent: "center",alignItems: "center",color: "#FFFFFF"}}>Claim Rewards <span style={{position: "absolute",width: "18px",height: "18px",left: "150px",top: "5px",background: "#373747",borderRadius: "200px"}}><img src={BSharesImage} alt="bshare.money" style={{position: "absolute",width: "12px",height: "12px",left: "3px",top: "2px"}} /></span></button>
            </div>
        </Grid>
        <Grid item xs={5} style={{background: "rgba(35, 40, 75, 0.75)",border: "1px solid #728CDF", backdropFilter: "blur(0px)",borderRadius: "10px"}}>
            <div style={{position: "absolute",left: "19px",top: "8px",fontFamily: "Nunito",fontStyle: "normal", fontWeight: "700",fontSize: "22px",lineHeight: "30px",color: "#FFFFFF"}}>Latest News</div>
        </Grid>
      </Grid>
      <Grid container xs={12} style={{position: "absolute",left: "12rem",top: "45rem",width: "62rem",height: "23.578rem",color: "#FFFFFF",background: "rgba(35, 40, 75, 0.75)",border: "1px solid #728CDF",backdropFilter: "blur(0px)",borderRadius: "10px"}}>
        <div style={{position: "absolute",width: "129px",height: "30px",left: "15px",top: "15px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "700",fontSize: "22px",lineHeight: "30px",color: "#FFFFFF"}}>Bomb Farms</div>
        <div style={{position: "absolute",width: "379px",height: "19px",left: "15px",top: "47px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "19px",color: "#FFFFFF"}}>Stake your LP tokens in our farms to start earning $BSHARE</div>
        <button style={{display: "flex",justifyContent: "center",position: "absolute",width: "150px",height: "30px",left: "810px",top: "29.43px",background: "none",border: "1px solid #FFFFFF",borderRadius: "20px",color: "#FFFFFF",alignItems: "center"}}>Claim All<span style={{position: "absolute",width: "18px",height: "18px",left: "103px",top: "5px",background: "#373747",borderRadius: "200px"}}><img src={BSharesImage} alt="bshare.money" style={{position: "absolute",width: "12px",height: "12px",left: "3px",top: "2px"}} /></span></button>
        <img src={BombBitcoinImage} alt="bombbitcoin.money" style={{position: "absolute",width: "33px",height: "33px",left: "24px",top: "92px"}} />
        <div style={{position: "absolute",width: "135px",height: "30px",left: "64px",top: "92.11px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "700",fontSize: "22px",lineHeight: "30px",color: "#FFFFFF"}}>BOMB-BTCB</div>
        <div style={{position: "absolute",width: "101px",height: "16px",left: "210px",top: "99px", fontFamily: "Nunito",fontStyle: "normal", fontWeight: "600",fontSize: "12px",lineHeight: "16px",background: "rgba(0, 232, 162, 0.25)",border: "1px solid #00E8A2",filter: "blur(0.5px)",display: "flex",justifyContent: "center",borderRadius: "3px",color: "#FFFFFF"}}>Recommended</div>
        <div style={{position: "absolute",width: "118px",height: "22px",left: "854px",top: "97px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "19px",color: "#FFFFFF"}}>TVL: $1,008,430</div>
        <div style={{position: "absolute",width: "895px",height: "0px",left: "64px",top: "122px",border: "0.5px solid rgba(195, 197, 203, 0.75)"}}></div>
        <div style={{position: "absolute",width: "92px",height: "52px",left: "30px",top: "137px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "19px",color: "#FFFFFF"}}>Daily Returns:<br/><span>2%</span></div>
        <div style={{position: "absolute",width: "85px",height: "64px",left: "172px",top: "137px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "19px",color: "#FFFFFF"}}>Your Stake: <br/><span><img src={BombBitcoinImage} alt="bombbitcoin.money" style={{width: "18px",height: "18px"}} />6.0000</span><br/><span>≈ $1171.62</span></div>
        <div style={{position: "absolute",width: "76px",height: "64px",left: "307px",top: "137px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "19px",color: "#FFFFFF"}}>Earned: <br/><span><img src={BSharesImage} alt="bshares.money" style={{width: "18px",height: "18px"}} />6.0000</span><br/><span>≈ $1171.62</span></div>
        <button style={{display: "grid",gridTemplateColumns: "auto auto",position: "absolute",width: "100px",height: "27px",left: "603px",top: "178px",background: "none",border: "1px solid #FFFFFF",borderRadius: "20px",justifyContent: "space-between",alignItems: "center",color: "#FFFFFF"}}>Deposit<span style={{background: "#FFFFFF",width: "17.5px",height: "17.5px",borderRadius: "200px"}}></span></button>
        <button style={{display: "grid",gridTemplateColumns: "auto auto",position: "absolute",width: "100px",height: "27px",left: "717px",top: "178px",background: "none",border: "1px solid #FFFFFF",borderRadius: "20px",justifyContent: "space-between",alignItems: "center",color: "#FFFFFF"}}>Withdraw<span style={{background: "#FFFFFF",width: "17.5px",height: "17.5px",borderRadius: "200px"}}></span></button>
        <button style={{display: "grid",position: "absolute",width: "131px",height: "30px",left: "830px",top: "177px",background: "none",border: "1px solid #FFFFFF",borderRadius: "20px",justifyContent: "space-between",alignItems: "center",color: "#FFFFFF"}}>Claim Rewards <span style={{position: "absolute",width: "18px",height: "18px",left: "104px",top: "5px",background: "#373747",borderRadius: "200px"}}><img src={BSharesImage} alt="bshare.money" style={{position: "absolute",width: "12px",height: "12px",left: "3px",top: "2px"}} /></span></button>
        <div style={{position: "absolute",width: "987px",height: "0px",left: "0px",top: "222px",border: "0.5px solid rgba(195, 197, 203, 0.75)"}}></div>
      
        <img src={BShareBnbImage} alt="bsharebnb.money" style={{position: "absolute",width: "33px",height: "33px",left: "24px",top: "242px"}} />
        <div style={{position: "absolute",width: "147px",height: "30px",left: "64px",top: "240.57px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "700",fontSize: "22px",lineHeight: "30px",color: "#FFFFFF"}}>BSHARE-BNB</div>
        <div style={{position: "absolute",width: "101px",height: "16px",left: "219.46px",top: "247.57px", fontFamily: "Nunito",fontStyle: "normal", fontWeight: "600",fontSize: "12px",lineHeight: "16px",background: "rgba(0, 232, 162, 0.25)",border: "1px solid #00E8A2",filter: "blur(0.5px)",display: "flex",justifyContent: "center",borderRadius: "3px",color: "#FFFFFF"}}>Recommended</div>
        <div style={{position: "absolute",width: "118px",height: "22px",left: "854px",top: "246px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "19px",color: "#FFFFFF"}}>TVL: $1,008,430</div>
        <div style={{position: "absolute",width: "895px",height: "0px",left: "64px",top: "271px",border: "0.5px solid rgba(195, 197, 203, 0.75)"}}></div>
        <div style={{position: "absolute",width: "92px",height: "52px",left: "30px",top: "286px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "19px",color: "#FFFFFF"}}>Daily Returns:<br/><span>2%</span></div>
        <div style={{position: "absolute",width: "85px",height: "64px",left: "172px",top: "286px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "19px",color: "#FFFFFF"}}>Your Stake: <br/><span><img src={BShareBnbImage} alt="bsharebnb.money" style={{width: "18px",height: "18px"}} />6.0000</span><br/><span>≈ $1171.62</span></div>
        <div style={{position: "absolute",width: "76px",height: "64px",left: "307px",top: "286px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "19px",color: "#FFFFFF"}}>Earned: <br/><span><img src={BSharesImage} alt="bshares.money" style={{width: "18px",height: "18px"}} />6.0000</span><br/><span>≈ $1171.62</span></div>
        <button style={{display: "grid",gridTemplateColumns: "auto auto",position: "absolute",width: "100px",height: "27px",left: "603px",top: "326px",background: "none",border: "1px solid #FFFFFF",borderRadius: "20px",justifyContent: "space-between",alignItems: "center",color: "#FFFFFF"}}>Deposit<span style={{background: "#FFFFFF",width: "17.5px",height: "17.5px",borderRadius: "200px"}}></span></button>
        <button style={{display: "grid",gridTemplateColumns: "auto auto",position: "absolute",width: "100px",height: "27px",left: "717px",top: "326px",background: "none",border: "1px solid #FFFFFF",borderRadius: "20px",justifyContent: "space-between",alignItems: "center",color: "#FFFFFF"}}>Withdraw<span style={{background: "#FFFFFF",width: "17.5px",height: "17.5px",borderRadius: "200px"}}></span></button>
        <button style={{display: "grid",position: "absolute",width: "131px",height: "30px",left: "830px",top: "325px",background: "none",border: "1px solid #FFFFFF",borderRadius: "20px",justifyContent: "space-between",alignItems: "center",color: "#FFFFFF"}}>Claim Rewards <span style={{position: "absolute",width: "18px",height: "18px",left: "104px",top: "5px",background: "#373747",borderRadius: "200px"}}><img src={BSharesImage} alt="bshare.money" style={{position: "absolute",width: "12px",height: "12px",left: "3px",top: "2px"}} /></span></button>
      </Grid>
      <Grid container xs={12} style={{position: "absolute",left: "12rem",top: "69.55rem",width: "62rem",height: "11.625rem",color: "#FFFFFF",background: "rgba(35, 40, 75, 0.75)",border: "1px solid #728CDF",backdropFilter: "blur(0px)",borderRadius: "10px"}}>
        <img src={BBondImage} alt="bbond.money" style={{position: "absolute",width: "48px",height: "48px",left: "22px",top: "14px"}} />
        <div style={{position: "absolute",width: "65px",height: "30px",left: "77px",top: "13.9px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "700",fontSize: "22px",lineHeight: "30px",color: "#FFFFFF"}}>Bonds</div>
        <div style={{position: "absolute",width: "638px",height: "18px",left: "77px",top: "43.9px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "14px",lineHeight: "19px",color: "#FFFFFF"}}>BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1</div>
        <div style={{position: "absolute",width: "172px",height: "25px",left: "35px",top: "86px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "300",fontSize: "16px",lineHeight: "25px",color: "#FFFFFF"}}>Current Price: (Bomb)^2</div>
        <div style={{position: "absolute",width: "148px",height: "22px",left: "347px",top: "91px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "400",fontSize: "16px",lineHeight: "22px",color: "#FFFFFF"}}>Available to redeem: </div>
        <div style={{position: "absolute",width: "121px",height: "22px",left: "624px",top: "75px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "600",fontSize: "16px",lineHeight: "22px",color: "#FFFFFF"}}>Purchase BBond</div>
        <div style={{position: "absolute",width: "124px",height: "22px",left: "623px",top: "94.9px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "300",fontSize: "16px",lineHeight: "22px",color: "#FFFFFF"}}>Bomb is over peg</div>
        <button style={{display: "grid",gridTemplateColumns: "auto auto",position: "absolute",width: "100px",height: "27px",left: "860px",top: "81.3px",background: "none",border: "1px solid #FFFFFF",borderRadius: "20px",justifyContent: "space-between",alignItems: "center",color: "#FFFFFF"}}>Purchase<span style={{background: "#FFFFFF",width: "17.5px",height: "17.5px",borderRadius: "200px"}}></span></button>
        <div style={{position: "absolute",width: "358px",height: "0px",left: "602px",top: "122px",border: "0.5px solid rgba(195, 197, 203, 0.75)"}}></div>
        <div style={{position: "absolute",width: "230px",height: "30px",left: "35px",top: "122px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "700",fontSize: "22px",lineHeight: "30px",color: "#FFFFFF"}}>BBond = 6.2872 BTCB</div>
        <img src={BBondImage} alt="bbond.money" style={{position: "absolute",width: "39px",height: "39px",left: "363px",top: "118px"}} />
        <div style={{position: "absolute",width: "65px",height: "49px",left: "402px",top: "113px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "600",fontSize: "36px",lineHeight: "49px",color: "#FFFFFF"}}>456</div>
        <div style={{position: "absolute",width: "108px",height: "22px",left: "626px",top: "128.6px",fontFamily: "Nunito",fontStyle: "normal",fontWeight: "600",fontSize: "16px",lineHeight: "22px",color: "#FFFFFF"}}>Redeem Bomb</div>
        <button style={{display: "grid",gridTemplateColumns: "auto auto",position: "absolute",width: "100px",height: "27px",left: "860px",top: "134.3px",background: "none",border: "1px solid #FFFFFF",borderRadius: "20px",justifyContent: "space-between",alignItems: "center",color: "#FFFFFF"}}>Redeem<span style={{background: "#FFFFFF",width: "17.5px",height: "17.5px",borderRadius: "200px"}}></span></button>
      </Grid>
      </div>
    // </Page>
  );
};

export default Dashboard;
