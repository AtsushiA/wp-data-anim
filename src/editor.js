( function ( wp ) {
	var registerBlockType  = wp.blocks.registerBlockType;
	var __                 = wp.i18n.__;
	var useBlockProps      = wp.blockEditor.useBlockProps;
	var InspectorControls  = wp.blockEditor.InspectorControls;
	var InnerBlocks        = wp.blockEditor.InnerBlocks;
	var PanelBody          = wp.components.PanelBody;
	var SelectControl      = wp.components.SelectControl;
	var RangeControl       = wp.components.RangeControl;
	var TextControl        = wp.components.TextControl;
	var ToggleControl      = wp.components.ToggleControl;
	var Fragment           = wp.element.Fragment;
	var createElement      = wp.element.createElement;

	// ─── アニメーション名リスト ───────────────────────────────────────
	var ANIMATION_OPTIONS = [
		{ label: __( 'なし', 'wp-data-anim' ), value: '' },
		// Fade
		{ label: 'fadeIn',      value: 'fadeIn' },
		{ label: 'fadeOut',     value: 'fadeOut' },
		{ label: 'fadeInUp',    value: 'fadeInUp' },
		{ label: 'fadeInDown',  value: 'fadeInDown' },
		{ label: 'fadeInLeft',  value: 'fadeInLeft' },
		{ label: 'fadeInRight', value: 'fadeInRight' },
		// Slide
		{ label: 'slideInUp',    value: 'slideInUp' },
		{ label: 'slideInDown',  value: 'slideInDown' },
		{ label: 'slideInLeft',  value: 'slideInLeft' },
		{ label: 'slideInRight', value: 'slideInRight' },
		// Zoom
		{ label: 'zoomIn',     value: 'zoomIn' },
		{ label: 'zoomOut',    value: 'zoomOut' },
		{ label: 'zoomInUp',   value: 'zoomInUp' },
		{ label: 'zoomInDown', value: 'zoomInDown' },
		// Bounce
		{ label: 'bounce',       value: 'bounce' },
		{ label: 'bounceIn',     value: 'bounceIn' },
		{ label: 'bounceInUp',   value: 'bounceInUp' },
		{ label: 'bounceInDown', value: 'bounceInDown' },
		// Attention
		{ label: 'shake',      value: 'shake' },
		{ label: 'pulse',      value: 'pulse' },
		{ label: 'wobble',     value: 'wobble' },
		{ label: 'flip',       value: 'flip' },
		{ label: 'swing',      value: 'swing' },
		{ label: 'rubberBand', value: 'rubberBand' },
		// Rotate
		{ label: 'rotateIn', value: 'rotateIn' },
		// Special
		{ label: 'blur',        value: 'blur' },
		{ label: 'clipReveal',  value: 'clipReveal' },
		{ label: 'typewriter',  value: 'typewriter' },
	];

	var TRIGGER_OPTIONS = [
		{ label: 'scroll（スクロール）', value: 'scroll' },
		{ label: 'load（ページ読み込み）', value: 'load' },
		{ label: 'click（クリック）', value: 'click' },
		{ label: 'hover（ホバー）', value: 'hover' },
	];

	var EASING_OPTIONS = [
		{ label: 'ease（デフォルト）', value: 'ease' },
		{ label: 'ease-out-expo', value: 'ease-out-expo' },
		{ label: 'ease-out-back', value: 'ease-out-back' },
		{ label: 'spring（スプリング）', value: 'spring' },
	];

	var DISABLE_OPTIONS = [
		{ label: __( '無効化しない', 'wp-data-anim' ), value: '' },
		{ label: 'モバイルで無効', value: 'mobile' },
		{ label: 'タブレットで無効', value: 'tablet' },
		{ label: 'デスクトップで無効', value: 'desktop' },
	];

	// ─── ブロック登録 ────────────────────────────────────────────────
	registerBlockType( 'wp-data-anim/data-anim', {
		apiVersion: 3,
		title:      __( 'Data Anim', 'wp-data-anim' ),
		icon:       'animation',
		category:   'design',
		supports:   { html: false, align: [ 'wide', 'full' ] },

		attributes: {
			animName:     { type: 'string',  default: 'fadeIn' },
			animTrigger:  { type: 'string',  default: 'scroll' },
			animDuration: { type: 'number',  default: 1600 },
			animDelay:    { type: 'number',  default: 0 },
			animEasing:   { type: 'string',  default: 'ease' },
			animOffset:   { type: 'number',  default: 0.2 },
			animDistance: { type: 'string',  default: '30px' },
			animOnce:     { type: 'boolean', default: false },
			animMirror:   { type: 'boolean', default: false },
			animDisable:  { type: 'string',  default: '' },
		},

		// ─── エディター表示 ──────────────────────────────────────────
		edit: function ( props ) {
			var attrs = props.attributes;
			var set   = props.setAttributes;

			var blockProps = useBlockProps( {
				className: 'wp-data-anim-editor-wrapper',
			} );

			return createElement( Fragment, null,

				// Inspector パネル
				createElement( InspectorControls, null,
					createElement( PanelBody, {
						title: __( 'アニメーション設定', 'wp-data-anim' ),
						initialOpen: true,
					},

						createElement( SelectControl, {
							label:    __( 'アニメーション種類', 'wp-data-anim' ),
							value:    attrs.animName,
							options:  ANIMATION_OPTIONS,
							onChange: function ( v ) { set( { animName: v } ); },
						} ),

						attrs.animName && createElement( Fragment, null,

							createElement( SelectControl, {
								label:    __( 'トリガー', 'wp-data-anim' ),
								value:    attrs.animTrigger,
								options:  TRIGGER_OPTIONS,
								onChange: function ( v ) { set( { animTrigger: v } ); },
							} ),

							createElement( RangeControl, {
								label:    __( 'duration（再生時間 ms）', 'wp-data-anim' ),
								value:    attrs.animDuration,
								min:      100,
								max:      5000,
								step:     100,
								onChange: function ( v ) { set( { animDuration: v } ); },
							} ),

							createElement( RangeControl, {
								label:    __( 'delay（遅延 ms）', 'wp-data-anim' ),
								value:    attrs.animDelay,
								min:      0,
								max:      3000,
								step:     100,
								onChange: function ( v ) { set( { animDelay: v } ); },
							} ),

							createElement( SelectControl, {
								label:    __( 'イージング', 'wp-data-anim' ),
								value:    attrs.animEasing,
								options:  EASING_OPTIONS,
								onChange: function ( v ) { set( { animEasing: v } ); },
							} ),

							createElement( RangeControl, {
								label:    __( 'offset（表示割合 0〜1）', 'wp-data-anim' ),
								value:    attrs.animOffset,
								min:      0,
								max:      1,
								step:     0.05,
								onChange: function ( v ) { set( { animOffset: v } ); },
							} ),

							createElement( TextControl, {
								label:    __( 'distance（移動距離）', 'wp-data-anim' ),
								value:    attrs.animDistance,
								help:     __( '例: 30px, 50px', 'wp-data-anim' ),
								onChange: function ( v ) { set( { animDistance: v } ); },
							} ),

							createElement( ToggleControl, {
								label:    __( '1回だけ再生（once）', 'wp-data-anim' ),
								checked:  attrs.animOnce,
								onChange: function ( v ) { set( { animOnce: v } ); },
							} ),

							createElement( ToggleControl, {
								label:    __( 'ミラー再生（viewport 離脱時に逆再生）', 'wp-data-anim' ),
								checked:  attrs.animMirror,
								onChange: function ( v ) { set( { animMirror: v } ); },
							} ),

							createElement( SelectControl, {
								label:    __( 'デバイス無効化', 'wp-data-anim' ),
								value:    attrs.animDisable,
								options:  DISABLE_OPTIONS,
								onChange: function ( v ) { set( { animDisable: v } ); },
							} )

						) // end attrs.animName &&
					) // end PanelBody
				), // end InspectorControls

				// ブロック本体
				createElement( 'div', blockProps,
					createElement( 'div', { className: 'wp-data-anim-editor-label' },
						createElement( 'span', null,
							__( 'Data Anim', 'wp-data-anim' ) + ': ' + ( attrs.animName || __( 'なし', 'wp-data-anim' ) )
						)
					),
					createElement( InnerBlocks, {
					__experimentalLayout: {
						type: 'default',
						alignments: [ 'wide', 'full' ],
					},
				} )
				)
			);
		},

		// ─── フロントエンド保存 ───────────────────────────────────────
		save: function ( props ) {
			var attrs = props.attributes;

			// data-* 属性を組み立て（デフォルト値は省略してHTML軽量化）
			var extraProps = {};

			if ( attrs.animName ) {
				extraProps[ 'data-anim' ] = attrs.animName;
			}
			if ( attrs.animTrigger && attrs.animTrigger !== 'scroll' ) {
				extraProps[ 'data-anim-trigger' ] = attrs.animTrigger;
			}
			if ( attrs.animDuration && attrs.animDuration !== 1600 ) {
				extraProps[ 'data-anim-duration' ] = attrs.animDuration;
			}
			if ( attrs.animDelay && attrs.animDelay > 0 ) {
				extraProps[ 'data-anim-delay' ] = attrs.animDelay;
			}
			if ( attrs.animEasing && attrs.animEasing !== 'ease' ) {
				extraProps[ 'data-anim-easing' ] = attrs.animEasing;
			}
			if ( typeof attrs.animOffset === 'number' && attrs.animOffset !== 0.2 ) {
				extraProps[ 'data-anim-offset' ] = attrs.animOffset;
			}
			if ( attrs.animDistance && attrs.animDistance !== '30px' ) {
				extraProps[ 'data-anim-distance' ] = attrs.animDistance;
			}
			if ( attrs.animOnce ) {
				extraProps[ 'data-anim-once' ] = '';
			}
			if ( attrs.animMirror ) {
				extraProps[ 'data-anim-mirror' ] = '';
			}
			if ( attrs.animDisable ) {
				extraProps[ 'data-anim-disable' ] = attrs.animDisable;
			}

			var blockProps = wp.blockEditor.useBlockProps.save( extraProps );

			return createElement( 'div', blockProps,
				createElement( InnerBlocks.Content, null )
			);
		},
	} );

} )( window.wp );
