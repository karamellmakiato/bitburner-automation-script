//get all servers
function getAllServers(ns) {
    let discovered = ["home"];

    for (let i = 0; i < discovered.length; i++) {
        let neighbors = ns.scan(discovered[i]);

        for (let server of neighbors) {
            if (!discovered.includes(server)) {
                discovered.push(server);
            }
        }
    }

    return discovered;
}

//main function which lets the script target the servers of your choosing
export async function main(ns) {

    let target = "rho-construction";
    let servers = getAllServers(ns);

    for (let server of servers) {
      if (server === "home") continue;

      //if open ports is 0, then it will check for each program that you have to try and pry open the server
      let ports = 0;

      if (ns.fileExists("BruteSSH.exe")) {
          ns.brutessh(server);
          ports++;
      }

      if (ns.fileExists("FTPCrack.exe")) {
          ns.ftpcrack(server);
          ports++;
      }
      if (ns.fileExists("RelaySMTP.exe")) {
          ns.relaysmtp(server);
          ports++;
      }
      if (ns.fileExists("HTTPWorm.exe")) {
          ns.httpworm(server);
          ports++;
      }
      if (ns.fileExists("SQLInject.exe")) {
          ns.sqlinject(server);
          ports++;
      }
      if (ns.getServerNumPortsRequired(server) <= ports) {
          ns.nuke(server);
      }
        /*if u finally have root access then it will run the
        poison.js file in every server you have root access in
        */
      if (!ns.hasRootAccess(server)) continue;
      await ns.scp("poison.js", server);
      let ramAvailable = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
      let ramPerThread = ns.getScriptRam("poison.js");
      let threads = Math.floor(ramAvailable / ramPerThread);
      if (threads > 0) {
        ns.exec("poison.js", server, threads, target);
      }

    }
}
