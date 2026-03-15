( function ( wp ) {
	var addFilter      = wp.hooks.addFilter;
	var __             = wp.i18n.__;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var PanelBody      = wp.components.PanelBody;
	var SelectControl  = wp.components.SelectControl;
	var RangeControl   = wp.components.RangeControl;
	var TextControl    = wp.components.TextControl;
	var ToggleControl  = wp.components.ToggleControl;
	var Fragment       = wp.element.Fragment;
	var createElement  = wp.element.createElement;
	var createHigherOrderComponent = wp.compose.createHigherOrderComponent;
	var assign         = Object.assign;

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

	// ─── 全ブロックにアニメーション属性を追加 ───────────────────────
	function addAnimAttributes( settings ) {
		settings.attributes = assign( {}, settings.attributes, {
			dataAnim:         { type: 'string',  default: '' },
			dataAnimTrigger:  { type: 'string',  default: 'scroll' },
			dataAnimDuration: { type: 'number',  default: 1600 },
			dataAnimDelay:    { type: 'number',  default: 0 },
			dataAnimEasing:   { type: 'string',  default: 'ease' },
			dataAnimOffset:   { type: 'number',  default: 0.2 },
			dataAnimDistance: { type: 'string',  default: '30px' },
			dataAnimOnce:     { type: 'boolean', default: false },
			dataAnimMirror:   { type: 'boolean', default: false },
			dataAnimDisable:  { type: 'string',  default: '' },
		} );
		return settings;
	}

	addFilter(
		'blocks.registerBlockType',
		'wp-data-anim/add-attributes',
		addAnimAttributes
	);

	// ─── エディターに InspectorControls パネルを追加 ────────────────
	var withAnimControls = createHigherOrderComponent( function ( BlockEdit ) {
		return function ( props ) {
			var attrs = props.attributes;
			var set   = props.setAttributes;

			return createElement( Fragment, null,
				createElement( BlockEdit, props ),
				createElement( InspectorControls, null,
					createElement( PanelBody, {
						title: __( 'アニメーション設定', 'wp-data-anim' ),
						initialOpen: false,
					},
						createElement( SelectControl, {
							label:    __( 'アニメーション種類', 'wp-data-anim' ),
							value:    attrs.dataAnim,
							options:  ANIMATION_OPTIONS,
							onChange: function ( v ) { set( { dataAnim: v } ); },
						} ),

						attrs.dataAnim && createElement( Fragment, null,

							createElement( SelectControl, {
								label:    __( 'トリガー', 'wp-data-anim' ),
								value:    attrs.dataAnimTrigger,
								options:  TRIGGER_OPTIONS,
								onChange: function ( v ) { set( { dataAnimTrigger: v } ); },
							} ),

							createElement( RangeControl, {
								label:    __( 'duration（再生時間 ms）', 'wp-data-anim' ),
								value:    attrs.dataAnimDuration,
								min:      100,
								max:      5000,
								step:     100,
								onChange: function ( v ) { set( { dataAnimDuration: v } ); },
							} ),

							createElement( RangeControl, {
								label:    __( 'delay（遅延 ms）', 'wp-data-anim' ),
								value:    attrs.dataAnimDelay,
								min:      0,
								max:      3000,
								step:     100,
								onChange: function ( v ) { set( { dataAnimDelay: v } ); },
							} ),

							createElement( SelectControl, {
								label:    __( 'イージング', 'wp-data-anim' ),
								value:    attrs.dataAnimEasing,
								options:  EASING_OPTIONS,
								onChange: function ( v ) { set( { dataAnimEasing: v } ); },
							} ),

							createElement( RangeControl, {
								label:    __( 'offset（表示割合 0〜1）', 'wp-data-anim' ),
								value:    attrs.dataAnimOffset,
								min:      0,
								max:      1,
								step:     0.05,
								onChange: function ( v ) { set( { dataAnimOffset: v } ); },
							} ),

							createElement( TextControl, {
								label:    __( 'distance（移動距離）', 'wp-data-anim' ),
								value:    attrs.dataAnimDistance,
								help:     __( '例: 30px, 50px', 'wp-data-anim' ),
								onChange: function ( v ) { set( { dataAnimDistance: v } ); },
							} ),

							createElement( ToggleControl, {
								label:    __( '1回だけ再生（once）', 'wp-data-anim' ),
								checked:  attrs.dataAnimOnce,
								onChange: function ( v ) { set( { dataAnimOnce: v } ); },
							} ),

							createElement( ToggleControl, {
								label:    __( 'ミラー再生（viewport 離脱時に逆再生）', 'wp-data-anim' ),
								checked:  attrs.dataAnimMirror,
								onChange: function ( v ) { set( { dataAnimMirror: v } ); },
							} ),

							createElement( SelectControl, {
								label:    __( 'デバイス無効化', 'wp-data-anim' ),
								value:    attrs.dataAnimDisable,
								options:  DISABLE_OPTIONS,
								onChange: function ( v ) { set( { dataAnimDisable: v } ); },
							} )

						) // end attrs.dataAnim &&
					) // end PanelBody
				) // end InspectorControls
			);
		};
	}, 'withAnimControls' );

	addFilter(
		'editor.BlockEdit',
		'wp-data-anim/with-controls',
		withAnimControls
	);

	// ─── 保存時に data-* 属性を付与 ─────────────────────────────────
	function addAnimSaveProps( extraProps, _blockType, attrs ) {
		if ( ! attrs.dataAnim ) {
			return extraProps;
		}

		extraProps[ 'data-anim' ] = attrs.dataAnim;

		if ( attrs.dataAnimTrigger && attrs.dataAnimTrigger !== 'scroll' ) {
			extraProps[ 'data-anim-trigger' ] = attrs.dataAnimTrigger;
		}
		if ( attrs.dataAnimDuration && attrs.dataAnimDuration !== 1600 ) {
			extraProps[ 'data-anim-duration' ] = attrs.dataAnimDuration;
		}
		if ( attrs.dataAnimDelay && attrs.dataAnimDelay > 0 ) {
			extraProps[ 'data-anim-delay' ] = attrs.dataAnimDelay;
		}
		if ( attrs.dataAnimEasing && attrs.dataAnimEasing !== 'ease' ) {
			extraProps[ 'data-anim-easing' ] = attrs.dataAnimEasing;
		}
		if ( typeof attrs.dataAnimOffset === 'number' && attrs.dataAnimOffset !== 0.2 ) {
			extraProps[ 'data-anim-offset' ] = attrs.dataAnimOffset;
		}
		if ( attrs.dataAnimDistance && attrs.dataAnimDistance !== '30px' ) {
			extraProps[ 'data-anim-distance' ] = attrs.dataAnimDistance;
		}
		if ( attrs.dataAnimOnce ) {
			extraProps[ 'data-anim-once' ] = '';
		}
		if ( attrs.dataAnimMirror ) {
			extraProps[ 'data-anim-mirror' ] = '';
		}
		if ( attrs.dataAnimDisable ) {
			extraProps[ 'data-anim-disable' ] = attrs.dataAnimDisable;
		}

		return extraProps;
	}

	addFilter(
		'blocks.getSaveContent.extraProps',
		'wp-data-anim/save-props',
		addAnimSaveProps
	);

} )( window.wp );
