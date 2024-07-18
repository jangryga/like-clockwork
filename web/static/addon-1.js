(function () {
    let newWorld;
    const locationSplit = location.host.split(".");
  
    if (window.GrooveObject) {
      return;
    }
  
    window.GrooveObject = {
      version: "2024.05.13-1 NI",
      callbacks: [],
      chatQueue: [],
      user: parseInt(getCookie("user_id"), 10),
      world: locationSplit[0].toLowerCase(),
      lang: locationSplit[2].toLowerCase(),
      forEachFighter: (data, callback) => {
        if (typeof data.f === "object" && data.f) {
          if (typeof data.f.w === "object" && data.f.w) {
            Object.entries(data.f.w).forEach((entry) => {
              const [key, val] = entry;
              callback(val, key);
            });
          }
        }
      },
      forEachLoot: (data, callback) => {
        if (typeof data.item === "object" && data.item) {
          Object.values(data.item).forEach((item) => {
            if (["l", "k"].includes(item.loc)) {
              callback(item, data.loot || {});
            }
          });
        }
      },
      getItemStat: (stat) => {
        if (typeof stat !== "string") return 0;
        if (stat.includes("unique")) {
          return 1;
        } else if (stat.includes("legendary")) {
          return 3;
        } else if (stat.includes("heroic")) {
          return 2;
        }
        return 0;
      },
      onBattleStart: (data, callback) => {
        if (typeof data.f === "object" && data.f) {
          if (data.f.init) {
            callback(data.f);
          }
        }
      },
      onBattleEnd: (data, callback) => {
        if (typeof data.f === "object" && data.f) {
          if (typeof data.f.m === "object" && data.f.m) {
            Object.values(data.f.m).forEach((log) => {
              if (typeof log === "string" && log.includes("winner=")) {
                callback(data.f);
              }
            });
          }
        }
      },
      onBattleLog: (data, callback) => {
        if (typeof data.f === "object" && data.f) {
          if (typeof data.f.m === "object" && data.f.m) {
            callback(data.f.m);
          }
        }
      },
      onLoots: (data, callback) => {
        if (typeof data.item === "object" && data.item) {
          const arr = [];
          Object.values(data.item).forEach((item) => {
            if (["l", "k"].includes(item.loc)) {
              arr.push(item);
            }
          });
          if (arr.length) {
            callback(arr, data.loot || {});
          }
        }
      },
      onLootSend: (data, callback) => {
        if (typeof data.loot === "object" && data.loot) {
          if (data.loot.init || data.loot.states || data.loot.timer) {
            callback();
          }
        }
      },
      forEachChatMsg: (data, callback) => {
        if (data?.chat?.channels) {
          for (let [channel, channelData] of Object.entries(data.chat.channels)) {
            if (!Array.isArray(channelData.msg)) {
              continue;
            }
  
            for (let message of channelData.msg) {
              callback({
                ...message,
                channel,
              });
            }
          }
        }
      },
      onNpcRemove: (data, callback) => {
        if (Array.isArray(data.npcs_del)) {
          data.npcs_del.forEach((item) => {
            const { id, respBaseSeconds } = item;
            callback(id, respBaseSeconds);
          });
        }
      },
      onNewNpc: (data, callback) => {
        if (Array.isArray(data.npcs)) {
          data.npcs.forEach((npc) => {
            callback(npc.id);
          });
        }
      },
      onNewPlayers: (data, callback) => {
        if (typeof data.other === "object" && data.other) {
          const ret = [];
          Object.entries(data.other).forEach((entry) => {
            const [key, val] = entry;
            if (val.nick) {
              ret.push(
                Object.assign(val, {
                  id: key,
                })
              );
            }
          });
          if (ret.length) {
            callback(ret);
          }
        }
      },
      insertChatMsg: (data, message) => {
        if (typeof data !== "object" || !data) {
          GrooveObject.chatQueue.push(message);
          return false;
        }
  
        data.chat = data.chat || {};
        data.chat.channels = data.chat.channels || {};
        data.chat.channels.system = data.chat.channels.system || {};
        data.chat.channels.system.msg = data.chat.channels.system.msg || [];
        data.chat.channels.system.msg.push(message);
  
        return true;
      },
    };
  
    switch (GrooveObject.world) {
      case "game1":
        newWorld = "classic";
        break;
      case "game2":
        newWorld = "tarhuna";
        break;
      case "game3":
        newWorld = "nerthus";
        break;
      case "game7":
        newWorld = "lelwani";
        break;
      case "game8":
        newWorld = "zemyna";
        break;
      case "game9":
        newWorld = "hutena";
        break;
      case "game10":
        newWorld = "jaruna";
        break;
    }
  
    GrooveObject.world = newWorld || GrooveObject.world;
  
    function getCookie(name) {
      const b = document.cookie;
      const e = name + "=";
      let d = b.indexOf("; " + e);
      if (d === -1) {
        d = b.indexOf(e);
        if (d !== 0) {
          return null;
        }
      } else {
        d += 2;
      }
      let a = document.cookie.indexOf(";", d);
      if (a === -1) {
        a = b.length;
      }
      return unescape(b.substring(d + e.length, a));
    }
  
    (() => {
      function fix() {
        if (
          typeof window.Engine !== "object" ||
          typeof window.Engine.communication !== "object"
        ) {
          setTimeout(fix, 100);
          return;
        }
  
        Engine.communication.successDataOld =
          Engine.communication.successData.bind(Engine.communication);
  
        Engine.communication.successData = (response) => {
          const parsed = JSON.parse(response);
          let wasSomethingAdded = false;
  
          if (typeof parsed === "object" && parsed && parsed.ev) {
            const length = Object.keys(parsed).length;
  
            if (GrooveObject.chatQueue.length) {
              const notInserted = [];
  
              GrooveObject.chatQueue.forEach((message, index) => {
                message.ts = parsed.ev + index;
                message.channel = "system";
                message.style = 3;
                message.id = Math.floor(parsed.ev + index);
                message.msg = message.msg
                  .split(" ")
                  .map((word) => {
                    return `[color=#feff00]${word}[/color]`;
                  })
                  .join(" ");
  
                const wasInserted = GrooveObject.insertChatMsg(parsed, message);
  
                if (wasInserted) {
                  wasSomethingAdded = true;
                } else {
                  notInserted.push(message);
                }
              });
  
              GrooveObject.chatQueue = notInserted;
            }
  
            if (length >= 3 || (length === 3 && !parsed.h)) {
              GrooveObject.callbacks.forEach((callback) => {
                try {
                  callback(parsed);
                } catch (error) {
                  console.error(error);
                }
              });
            }
          }
  
          if (wasSomethingAdded) {
            wasSomethingAdded = false;
            Engine.communication.successDataOld(JSON.stringify(parsed));
          } else {
            Engine.communication.successDataOld(response);
          }
        };
      }
  
      setTimeout(fix, 100);
    })();
  })(window);
  