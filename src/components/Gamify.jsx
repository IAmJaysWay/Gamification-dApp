import { Typography, Tag, Button, Table, Space, Card, Modal } from "antd";
import { FireFilled } from "@ant-design/icons";
import Runes from "../Runes.png";
import RunesCollected from "../RunesCollected.png";
import Mages from "../Mages.png";
import Hoodie from "../Hoodie.png";
import Blockie from "./Blockie";
import { getEllipsisTxt } from "helpers/formatters";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import moment from "moment";
import useCollectors from "hooks/useCollectors";
import { useState, useEffect } from "react";

const { Title } = Typography;

const styles = {
  collected: {
    marginTop: "20px",
    marginBottom: "40px",
    width: "310px",
    height: "150px",
    background: "#21bf96",
    borderRadius: "20px",
    display: "flex",
    overflow: "hidden",
  },
  colHeading: {
    padding: "27px",
    fontSize: "12px",
    width: "200px",
  },
  count: {
    fontSize: "28px",
    fontWeight: "600",
    marginTop: "5px",
  },
  daily: {
    marginTop: "20px",
    marginBottom: "35px",
    display: "flex",
    justifyContent: "space-between",
  },
  rew: {
    marginTop: "20px",
    marginBottom: "35px",
    display: "flex",
    gap: "35px",
    flexWrap: "wrap",
  },
  collect: {
    background: "#21bf96",
    borderColor: "#21bf96",
    width: "150px",
  },
  cantCollect: {
    background: "#c5c9c7",
    borderColor: "#c5c9c7",
    width: "150px",
  },
  claimrow: {
    display: "flex",
    gap: "25px",
    marginBottom: "35px",
    flexWrap: "wrap",
  },
  rewardCard: {
    width: "310px",
    height: "400px",
    borderRadius: "15px",
  },
  rewardImg: {
    height: "200px",
    overflow: "hidden",
    borderRadius: "15px 15px 0 0",
  },
  bottom: {
    position: "absolute",
    bottom: "24px",
    left: "24px",
    width: "262px",
    display: "flex",
    justifyContent: "space-between",
  },
};

export default function Gamify({ tab }) {
  const { Moralis, account, isInitialized, isAuthenticated } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();
  const days = [10, 10, 10, 20, 20, 20, 50];
  const { getDays, getLeaderBoard } = useCollectors();

  const [daysStreak, setDaysStreak] = useState(-1);
  const [collected, setCollected] = useState(true);
  const [userRunes, setUserRunes] = useState(0);
  const [dataSource, setDataSource] = useState();

  function getUsers(i) {
    if (i === daysStreak && !collected) {
      return "runeBtn2";
    } else {
      return "runeBtn";
    }
  }

  async function mintNFT() {
    if (userRunes < 2000) {
      let secondsToGo = 5;
      const modal = Modal.error({
        title: "Hold Up!",
        content: `Make sure you collect enough runes before collecting this reward`,
      });
      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
      return;
    }

    let options = {
      contractAddress: "0x8A296092241568F038f8bCC211466ed015453352",
      functionName: "createToken",
      abi: [
        {
          inputs: [],
          name: "createToken",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
    };

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        let secondsToGo = 10;
        const modal = Modal.success({
          title: "Success!",
          content: `Check your wallet for your new magical NFT`,
        });
        setTimeout(() => {
          modal.destroy();
        }, secondsToGo * 1000);
      },
    });
  }

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const fetchStreak = async () => {
        const data = await getDays();
        const { daysInARow, lastCollected, runes } = data.attributes;
        setDaysStreak(daysInARow);
        setCollected(moment(lastCollected).isSame(moment.utc(), "day"));
        setUserRunes(runes);
        const dataLeader = await getLeaderBoard();
        setDataSource(dataLeader);
      };
      fetchStreak();
    } else {
      setDaysStreak(-1);
      setCollected(true);
      setUserRunes(0);
    }
  }, [isInitialized, isAuthenticated]);

  async function addRunes() {
    const users = Moralis.Object.extend("RuneCollectors");
    const query = new Moralis.Query(users);
    query.equalTo("ethAddress", account);
    const data = await query.first();
    const { lastCollected, daysInARow, runes } = data.attributes;

    if (!lastCollected || !moment(lastCollected).isSame(moment.utc(), "day")) {
      data.increment("runes", days[daysInARow]);
      data.set("lastCollected", moment.utc().format());
      setCollected(true);
      setUserRunes(runes + days[daysInARow]);
      if (daysInARow === 6) {
        data.set("daysInARow", 0);
        setDaysStreak(0);
      } else {
        setDaysStreak(daysInARow + 1);
        data.increment("daysInARow");
      }
      data.save();
      succCollect(days[daysInARow]);
    } else {
      failCollect();
    }
  }

  function succCollect() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: (
        <>
          <p>You have collected some runes</p>
          <img src={Runes} alt="" style={{ width: "280px" }} />
        </>
      ),
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failCollect() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Hold Up!",
      content: `You can only collect runes once a day, please come back tomorrow`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: "Mage",
      key: "ethAddress",
      render: (text, record) => (
        <Space size="middle">
          <Blockie
            style={{ border: "solid 2px white" }}
            address={record.ethAddress}
            scale={4}
          />
          <span>{getEllipsisTxt(record.ethAddress, 6)}</span>
        </Space>
      ),
    },
    {
      title: "Runes Accumulated",
      dataIndex: "runes",
      key: "runes",
      align: "right",
    },
  ];

  if (tab === "runes") {
    return (
      <div style={{ paddingLeft: "5vw", width: "70vw" }}>
        <Title level={2} style={{ color: "white" }}>
          My Moralis Runes
        </Title>
        <p style={{ color: "gray" }}>
          Collect Moralis Runes, climb the communnity leaderboard and claim
          magical rewards
        </p>

        <div style={styles.collected}>
          <div style={styles.colHeading}>
            <span>My Runes</span>
            <p style={styles.count}>{userRunes}</p>
          </div>
          <div>
            <img src={Runes} alt="" />
          </div>
        </div>

        <Tag color="rgba(47,79,79, 0.2)" style={{ color: "#21bf96" }}>
          Collect Runes
        </Tag>

        <div style={styles.daily}>
          <div>
            <Title level={3} style={{ color: "white" }}>
              Daily Rune Collection
            </Title>
            <p style={{ color: "gray" }}>
              If you visit us everyday you will have the opportunity to receive
              bonus runes
            </p>
          </div>
          <Button
            style={collected ? styles.cantCollect : styles.collect}
            onClick={() => addRunes()}
          >
            Collect Runes
          </Button>
        </div>
        <div style={styles.claimrow}>
          {days.map((e, i) => (
            <>
              <div className={getUsers(i)}>
                <p style={{ fontSize: "12px" }}>{`Day ${i + 1}`}</p>
                {i > daysStreak - 1 ? (
                  <img
                    src={Runes}
                    alt=""
                    style={{ width: "40%", margin: "6px auto" }}
                  />
                ) : (
                  <img
                    src={RunesCollected}
                    alt=""
                    style={{ width: "60%", margin: " auto" }}
                  />
                )}
                <p style={{ color: "white", fontSize: "18px" }}>{`+${e}`}</p>
              </div>
            </>
          ))}
        </div>
        <span style={{ color: "gray" }}>
          Learn more abour Moralis?{" "}
          <a href="https://www.moralis.io">Our website</a>
        </span>
      </div>
    );
  }

  if (tab === "rewards") {
    return (
      <div style={{ paddingLeft: "5vw", width: "70vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Title level={2} style={{ color: "white" }}>
            Claim Your Rewards
          </Title>
          <Space size={"small"}>
            <span style={{ color: "gray" }}> Your Runes:</span>
            <Tag color={"#324252"} style={{ height: "22px" }}>
              <FireFilled /> {userRunes}
            </Tag>
          </Space>
        </div>

        <p style={{ color: "gray", marginBottom: "35px" }}>
          Dillignetly collecting runes will allow you to claim amazing rewards
          like NFTs and merch. Browse to see what you can afford.
        </p>

        <Tag color="rgba(47,79,79, 0.2)" style={{ color: "#21bf96" }}>
          Claim Rewards
        </Tag>
        <div style={styles.rew}>
          <Card
            onClick={() => mintNFT()}
            hoverable
            style={styles.rewardCard}
            cover={
              <div style={styles.rewardImg}>
                <img src={Mages} alt=""></img>
              </div>
            }
          >
            <Title level={5} style={{ color: "white" }}>
              Rune Collector - Mage NFT
            </Title>
            <p style={{ color: "gray" }}>
              Collect enough runes to earn the title of Rune Collector and join
              a community of Mage NFT holders.
            </p>
            <div style={styles.bottom}>
              <Space size={"small"}>
                <span style={{ color: "gray" }}> Price:</span>
                <Tag color={"#324252"} style={{ height: "22px" }}>
                  <FireFilled /> 2000
                </Tag>
              </Space>
              <span style={{ color: "gray" }}> Supply: 670/1000</span>
            </div>
          </Card>
          <Card
            hoverable
            style={styles.rewardCard}
            cover={
              <div style={styles.rewardImg}>
                <img src={Hoodie} alt=""></img>
              </div>
            }
          >
            <Title level={5} style={{ color: "white" }}>
              Moralis Merch - Hoodie
            </Title>
            <p style={{ color: "gray" }}>
              Upgrade your wardrobe, by coverting your runes into some fresh
              Moralis swag!
            </p>
            <div style={styles.bottom}>
              <Space size={"small"}>
                <span style={{ color: "gray" }}> Price:</span>
                <Tag color={"#324252"} style={{ height: "22px" }}>
                  <FireFilled /> 10000
                </Tag>
              </Space>
              <span style={{ color: "gray" }}> Supply: Infinite</span>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (tab === "leaderboard") {
    return (
      <div style={{ paddingLeft: "5vw", width: "70vw" }}>
        <Title level={2} style={{ color: "white" }}>
          Moralis Rune Collectors Leaderboard
        </Title>
        <p style={{ color: "gray" }}>
          Ranking of mages with the highest number of runes accumulated
        </p>
        {dataSource && (
          <Table
            style={{ marginTop: "35px" }}
            dataSource={dataSource}
            columns={columns}
          />
        )}
      </div>
    );
  }
}
