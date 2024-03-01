// Combine multiple video chunks, useful for decentralized rendering

import {rmSync} from 'node:fs';
import {join} from 'node:path';
import type {AudioCodec} from './audio-codec';
import {getDefaultAudioCodec} from './audio-codec';
import type {Codec} from './codec';
import {createCombinedAudio} from './combine-audio';
import {combineVideoStreamsSeamlessly} from './combine-video-streams-seamlessly';
import {createCombinedVideo} from './create-combined-video';
import {getExtensionFromAudioCodec} from './get-extension-from-audio-codec';
import {getFileExtensionFromCodec} from './get-extension-from-codec';
import {isAudioCodec} from './is-audio-codec';
import type {LogLevel} from './log-level';
import {Log} from './logger';
import type {CancelSignal} from './make-cancel-signal';
import {muxVideoAndAudio} from './mux-video-and-audio';
import {truthy} from './truthy';

type Options = {
	files: string[];
	filelistDir: string;
	output: string;
	onProgress: (p: number) => void;
	numberOfFrames: number;
	codec: Codec;
	fps: number;
	numberOfGifLoops: number | null;
	audioCodec: AudioCodec | null;
	audioBitrate: string | null;
	indent: boolean;
	logLevel: LogLevel;
	chunkDurationInSeconds: number;
	binariesDirectory: string | null;
	cancelSignal: CancelSignal | undefined;
	seamless: boolean;
};

export const combineVideos = async ({
	files,
	filelistDir,
	output,
	onProgress,
	numberOfFrames,
	codec,
	fps,
	numberOfGifLoops,
	audioCodec,
	audioBitrate,
	indent,
	logLevel,
	chunkDurationInSeconds,
	binariesDirectory,
	cancelSignal,
	seamless,
}: Options) => {
	const resolvedAudioCodec =
		audioCodec ?? getDefaultAudioCodec({codec, preferLossless: false});

	const shouldCreateAudio = resolvedAudioCodec !== null;
	const shouldCreateVideo = !isAudioCodec(codec);

	const videoOutput = join(
		filelistDir,
		`video.${getFileExtensionFromCodec(codec, resolvedAudioCodec)}`,
	);

	const audioOutput = shouldCreateAudio
		? join(
				filelistDir,
				`audio.${getExtensionFromAudioCodec(resolvedAudioCodec)}`,
			)
		: null;

	const audioFiles = files.filter((f) => f.endsWith('audio'));
	const videoFiles = files.filter((f) => f.endsWith('video'));

	let concatenatedAudio = 0;
	let concatenatedVideo = 0;
	let muxing = 0;

	const updateProgress = () => {
		const totalFrames =
			(shouldCreateAudio ? numberOfFrames : 0) +
			(shouldCreateVideo ? numberOfFrames : 0) +
			numberOfFrames;
		const actualProgress = concatenatedAudio + concatenatedVideo + muxing;

		onProgress((actualProgress / totalFrames) * numberOfFrames);
	};

	Log.verbose(
		{indent, logLevel},
		`Combining chunks ${seamless ? 'seamlessly' : 'normally'}`,
	);
	await Promise.all(
		[
			shouldCreateAudio
				? createCombinedAudio({
						audioBitrate,
						filelistDir,
						files: audioFiles,
						indent,
						logLevel,
						output: shouldCreateVideo ? (audioOutput as string) : output,
						resolvedAudioCodec,
						seamless,
						chunkDurationInSeconds,
						addRemotionMetadata: !shouldCreateVideo,
						binariesDirectory,
						fps,
						cancelSignal,
						onProgress: (frames) => {
							concatenatedAudio = frames;
							updateProgress();
						},
					})
				: null,

			shouldCreateVideo && !seamless
				? createCombinedVideo({
						codec,
						filelistDir,
						fps,
						indent,
						logLevel,
						numberOfGifLoops,
						output: shouldCreateAudio ? videoOutput : output,
						files: videoFiles,
						addRemotionMetadata: !shouldCreateAudio,
						binariesDirectory,
						cancelSignal,
						onProgress: (frames) => {
							concatenatedVideo = frames;
							updateProgress();
						},
						seamless,
					})
				: null,
		].filter(truthy),
	);

	if (!(audioOutput && shouldCreateVideo)) {
		rmSync(filelistDir, {recursive: true});
		return;
	}

	try {
		await muxVideoAndAudio({
			audioOutput,
			indent,
			logLevel,
			onProgress: (frames) => {
				muxing = frames;
				updateProgress();
			},
			output,
			videoOutput: seamless
				? combineVideoStreamsSeamlessly({files: videoFiles})
				: videoOutput,
			binariesDirectory,
			fps,
			cancelSignal,
		});
		onProgress(numberOfFrames);
		rmSync(filelistDir, {recursive: true});
	} catch (err) {
		rmSync(filelistDir, {recursive: true});
		throw err;
	}
};
