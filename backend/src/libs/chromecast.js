let player = null;
const cast = (episode, urls) => {
    const subtitles = Boolean(episode?.subs) ? [`${urls.lan}/api/subs/${episode.fullId}`] : null;
    if (!player) {
        const list = require('chromecasts')();
        list.on('update', players => {
            players.play(`${urls.lan}/api/file/${episode.fullId}`, { title: `${episode.show} - ${episode.name}`, subtitles, autoSubtitles: true });
            if (players) list.removeAllListeners();
            player = players;
        });
        return;
    }

    player.play(`${urls.lan}/api/file/${episode.fullId}`, { title: `${episode.show} - ${episode.name}`, subtitles, autoSubtitles: true });
};

const command = cmd => {
    if (!player) {
        console.log('no player');
        return;
    }

    if (cmd === "resume") {
        player.resume();
    } else if (cmd === "pause") {
        player.pause();
    } else if (cmd === "stop") {
        player.stop();
    }

};


module.exports = { cast, command };
