<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs tei"
    version="2.0">
    
    <!-- <xsl:output method="xml" omit-xml-declaration="yes" indent="yes" /> -->
    <xsl:template match="tei:teiHeader"/>

    <xsl:template match="tei:body">
        <div class="row">
        <div class="col-3"><br/><br/><br/><br/><br/>
            <xsl:for-each select="//tei:add[@place = 'marginleft']">
                <xsl:choose>
                    <xsl:when test="parent::tei:del">
                        <del>
                            <xsl:attribute name="class">
                                <xsl:value-of select="attribute::hand" />
                            </xsl:attribute>
                            <xsl:value-of select="."/></del><br/>
                    </xsl:when>
                    <xsl:otherwise>
                        <span >
                            <xsl:attribute name="class">
                                <xsl:value-of select="attribute::hand" />
                            </xsl:attribute>
                        <xsl:value-of select="."/><br/>
                        </span>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:for-each> 
        </div>
        <div class="col-9">
            <div class="transcription">
                <xsl:apply-templates select="//tei:div"/>
            </div>
        </div>
        </div> 
    </xsl:template>
    
    <xsl:template match="tei:div">
        <div class="#MWS"><xsl:apply-templates/></div>
    </xsl:template>
    
    <xsl:template match="tei:p">
        <p class="my-custom-class" style="line-height: 1.7;"><xsl:apply-templates/></p>
    </xsl:template>

  
    <xsl:template match="tei:add[@place = 'marginleft']">
        <span class="marginAdd">
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    
    <xsl:template match="tei:del">
        <del>
            <xsl:attribute name="class">
                <xsl:value-of select="@hand"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </del>
    </xsl:template>

    <xsl:template match="tei:lb">
        <br/>
    </xsl:template>
    
    <xsl:template match="tei:add[@place='supralinear']">
        <span class="supralinear">
            <xsl:attribute name="class">
                <xsl:value-of select="@hand"/>
            </xsl:attribute>
            <sup>
                <xsl:apply-templates/>
            </sup>
        </span>
    </xsl:template>
    
    <xsl:template match="tei:hi[@rend='underline']">
        <u>
            <xsl:apply-templates/>
        </u>
    </xsl:template>
   
    <xsl:template match="tei:hi[@rend='circled']">
        <span class="circled smaller-circle">
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    
    <xsl:template match="tei:del/add[@place='overwritten']">
        <span class="overwritten">
            <del>
                <xsl:attribute name="class">
                    <xsl:value-of select="@hand"/>
                </xsl:attribute>
                <xsl:apply-templates/>
            </del>
            <add>
                <xsl:attribute name="place">
                    <xsl:value-of select="@place"/>
                </xsl:attribute>
                <xsl:attribute name="hand">
                    <xsl:value-of select="@hand"/>
                </xsl:attribute>
                <xsl:apply-templates/>
            </add>
        </span>
    </xsl:template>

    
</xsl:stylesheet>
