import React from 'react';
import {BACKGROUND} from '../helpers/colors';
import {FONT_FAMILY} from '../helpers/font';
import {HigherZIndex} from '../state/z-index';

const backgroundOverlay: React.CSSProperties = {
	backgroundColor: 'rgba(255, 255, 255, 0.2)',
	backdropFilter: `blur(1px)`,
	position: 'fixed',
	height: '100%',
	width: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};

const panel: React.CSSProperties = {
	backgroundColor: BACKGROUND,
	boxShadow: '0 0 4px black',
	color: 'white',
	fontFamily: FONT_FAMILY,
};

export const ModalContainer: React.FC<{
	onEscape: () => void;
}> = ({children, onEscape}) => {
	return (
		<HigherZIndex onEscape={onEscape}>
			<div style={backgroundOverlay} role="dialog" aria-modal="true">
				<div style={panel}>{children}</div>
			</div>
		</HigherZIndex>
	);
};
